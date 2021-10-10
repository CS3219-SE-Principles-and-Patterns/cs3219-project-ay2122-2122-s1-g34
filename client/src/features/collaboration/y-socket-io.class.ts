import { fromUint8Array, toUint8Array } from "js-base64";
import * as decoding from "lib0/decoding";
import * as encoding from "lib0/encoding";
import * as mutex from "lib0/mutex";
import { Observable } from "lib0/observable";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";
import * as awarenessProtocol from "y-protocols/awareness";
import * as syncProtocol from "y-protocols/sync";
import * as Y from "yjs";

const messageSync = 0;
const messageQueryAwareness = 3;
const messageAwareness = 1;

type MessageHandlers = Array<
  (
    arg0: encoding.Encoder,
    arg1: decoding.Decoder,
    arg2: SocketIoProvider,
    arg3: boolean,
    arg4: number
  ) => void
>;

const messageHandlers: MessageHandlers = [];

messageHandlers[messageSync] = (
  encoder,
  decoder,
  provider,
  emitSynced,
  messageType
) => {
  encoding.writeVarUint(encoder, messageSync);
  const syncMessageType = syncProtocol.readSyncMessage(
    decoder,
    encoder,
    provider.doc,
    provider
  );
  if (
    emitSynced &&
    syncMessageType === syncProtocol.messageYjsSyncStep2 &&
    !provider.synced
  ) {
    provider.synced = true;
  }
};

messageHandlers[messageQueryAwareness] = (
  encoder,
  decoder,
  provider,
  emitSynced,
  messageType
) => {
  encoding.writeVarUint(encoder, messageAwareness);
  encoding.writeVarUint8Array(
    encoder,
    awarenessProtocol.encodeAwarenessUpdate(
      provider.awareness,
      Array.from(provider.awareness.getStates().keys())
    )
  );
};

messageHandlers[messageAwareness] = (
  encoder,
  decoder,
  provider,
  emitSynced,
  messageType
) => {
  awarenessProtocol.applyAwarenessUpdate(
    provider.awareness,
    decoding.readVarUint8Array(decoder),
    provider
  );
};

const readMessage = (
  provider: SocketIoProvider,
  buf: Uint8Array,
  emitSynced: boolean
) => {
  const decoder = decoding.createDecoder(buf);
  const encoder = encoding.createEncoder();
  const messageType = decoding.readVarUint(decoder);
  const messageHandler = provider.messageHandlers[messageType];
  if (messageHandler) {
    messageHandler(encoder, decoder, provider, emitSynced, messageType);
  } else {
    console.error("Unable to compute message");
  }
  return encoder;
};

const setupWS = (provider: SocketIoProvider) => {
  if (provider.shouldConnect) {
    provider.wsconnecting = true;
    provider.wsconnected = false;
    provider.synced = false;

    provider.socket.on("collaboration", (data: string) => {
      const binaryEncoded = toUint8Array(data);
      const encoder = readMessage(provider, binaryEncoded, true);
      if (encoding.length(encoder) > 1) {
        const base64Encoded = fromUint8Array(encoding.toUint8Array(encoder));
        provider.socket.emit("collaboration", base64Encoded);
      }
    });

    provider.socket.on("disconnect", (reason) => {
      if (reason === "transport close") {
        provider.wsconnecting = false;
        if (provider.wsconnected) {
          provider.wsconnected = false;
          provider.synced = false;
          // update awareness (all users except local left)
          awarenessProtocol.removeAwarenessStates(
            provider.awareness,
            Array.from(provider.awareness.getStates().keys()).filter(
              (client) => client !== provider.doc.clientID
            ),
            provider
          );
          provider.emit("status", [
            {
              status: "disconnected",
            },
          ]);
        } else {
          provider.wsUnsuccessfulReconnects++;
        }
      }
    });

    const onConnect = () => {
      provider.wsconnecting = false;
      provider.wsconnected = true;
      provider.wsUnsuccessfulReconnects = 0;
      provider.emit("status", [
        {
          status: "connected",
        },
      ]);
      // always send sync step 1 when connected
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, messageSync);
      syncProtocol.writeSyncStep1(encoder, provider.doc);
      const base64Encoded = fromUint8Array(encoding.toUint8Array(encoder));
      provider.socket.emit("collaboration", base64Encoded);
      // broadcast local awareness state
      if (provider.awareness.getLocalState() !== null) {
        const encoderAwarenessState = encoding.createEncoder();
        encoding.writeVarUint(encoderAwarenessState, messageAwareness);
        encoding.writeVarUint8Array(
          encoderAwarenessState,
          awarenessProtocol.encodeAwarenessUpdate(provider.awareness, [
            provider.doc.clientID,
          ])
        );
        const base64Encoded = fromUint8Array(
          encoding.toUint8Array(encoderAwarenessState)
        );
        provider.socket.emit("collaboration", base64Encoded);
      }
    };

    if (provider.socket.connected) {
      onConnect();
    } else {
      provider.socket.on("connect", onConnect);
    }

    provider.emit("status", [
      {
        status: "connecting",
      },
    ]);
  }
};

/**
 * @param {WebsocketProvider} provider
 * @param {ArrayBuffer} buf
 */
const broadcastMessage = (provider: SocketIoProvider, buf: Uint8Array) => {
  const base64Encoded = fromUint8Array(buf);
  provider.socket.emit("collaboration", base64Encoded);
};

/**
 * Websocket Provider for Yjs. Creates a websocket connection to sync the shared document.
 * The document name is attached to the provided url. I.e. the following example
 * creates a websocket connection to http://localhost:1234/my-document-name
 *
 * @example
 *   import * as Y from 'yjs'
 *   import { WebsocketProvider } from 'y-websocket'
 *   const doc = new Y.Doc()
 *   const provider = new WebsocketProvider('http://localhost:1234', 'my-document-name', doc)
 *
 * @extends {Observable<string>}
 */
export class SocketIoProvider extends Observable<string> {
  doc: any;
  mux: mutex.mutex;
  private _synced: boolean;

  messageHandlers: MessageHandlers;
  private _updateHandler: (update: Uint8Array, origin: any) => void;
  private _awarenessUpdateHandler: (
    {
      added,
      updated,
      removed,
    }: { added: any[]; updated: any[]; removed: any[] },
    origin: any
  ) => void;
  awareness: awarenessProtocol.Awareness;
  private _beforeUnloadHandler: () => void;
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
  wsconnected: boolean;
  wsconnecting: boolean;
  wsUnsuccessfulReconnects: number;
  shouldConnect: boolean;

  constructor(socket: Socket<DefaultEventsMap, DefaultEventsMap>, doc: Y.Doc) {
    super();

    this.shouldConnect = false;
    this.wsconnected = false;
    this.wsconnecting = false;
    this.wsUnsuccessfulReconnects = 0;
    this.messageHandlers = messageHandlers.slice();

    this.awareness = new awarenessProtocol.Awareness(doc);
    this.socket = socket;
    this._synced = false;
    this.doc = doc;
    this.mux = mutex.createMutex();

    /**
     * Listens to Yjs updates and sends them to remote peers
     */
    this._updateHandler = (update, origin) => {
      if (origin !== this) {
        const encoder = encoding.createEncoder();
        encoding.writeVarUint(encoder, messageSync);
        syncProtocol.writeUpdate(encoder, update);
        broadcastMessage(this, encoding.toUint8Array(encoder));
      }
    };
    this.doc.on("update", this._updateHandler);

    this._awarenessUpdateHandler = ({ added, updated, removed }, origin) => {
      const changedClients = added.concat(updated).concat(removed);
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, messageAwareness);
      encoding.writeVarUint8Array(
        encoder,
        awarenessProtocol.encodeAwarenessUpdate(this.awareness, changedClients)
      );
      broadcastMessage(this, encoding.toUint8Array(encoder));
    };
    this._beforeUnloadHandler = () => {
      awarenessProtocol.removeAwarenessStates(
        this.awareness,
        [doc.clientID],
        "window unload"
      );
    };
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", this._beforeUnloadHandler);
    } else if (typeof process !== "undefined") {
      process.on("exit", () => this._beforeUnloadHandler);
    }
    this.awareness.on("update", this._awarenessUpdateHandler);
    this.connect();
  }

  get synced() {
    return this._synced;
  }

  set synced(state) {
    if (this._synced !== state) {
      this._synced = state;
      this.emit("synced", [state]);
      this.emit("sync", [state]);
    }
  }

  destroy() {
    this.disconnect();
    if (typeof window !== "undefined") {
      window.removeEventListener("beforeunload", this._beforeUnloadHandler);
    } else if (typeof process !== "undefined") {
      process.off("exit", () => this._beforeUnloadHandler);
    }
    this.awareness.off("update", this._awarenessUpdateHandler);
    this.doc.off("update", this._updateHandler);
    super.destroy();
  }

  disconnect() {
    this.socket.disconnect();
  }

  connect() {
    this.shouldConnect = true;
    if (!this.wsconnected) {
      setupWS(this);
    }
  }
}
