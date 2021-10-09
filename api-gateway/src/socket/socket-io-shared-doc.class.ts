import { fromUint8Array } from "js-base64";
import * as decoding from "lib0/decoding";
import * as encoding from "lib0/encoding";
import * as map from "lib0/map";
import * as mutex from "lib0/mutex";
import * as _ from "lodash";
import { Socket } from "socket.io";
import * as awarenessProtocol from "y-protocols/awareness";
import * as syncProtocol from "y-protocols/sync";
import * as Y from "yjs";

// disable gc when using snapshots!
const gcEnabled = process.env.GC !== "false" && process.env.GC !== "0";
const persistenceDir = process.env.YPERSISTENCE;

let persistence: {
  bindState: (arg0: string, arg1: SocketIoSharedDoc) => void;
  writeState: (arg0: string, arg1: SocketIoSharedDoc) => Promise<any>;
  provider: any;
} | null = null;
if (typeof persistenceDir === "string") {
  console.info('Persisting documents to "' + persistenceDir + '"');
  const LeveldbPersistence = require("y-leveldb").LeveldbPersistence;
  const ldb = new LeveldbPersistence(persistenceDir);
  persistence = {
    provider: ldb,
    bindState: async (docName, ydoc) => {
      const persistedYdoc = await ldb.getYDoc(docName);
      const newUpdates = Y.encodeStateAsUpdate(ydoc);
      ldb.storeUpdate(docName, newUpdates);
      Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(persistedYdoc));
      ydoc.on("update", (update) => {
        ldb.storeUpdate(docName, update);
      });
    },
    writeState: async (docName, ydoc) => {},
  };
}

export const setPersistence = (
  persistence_: {
    bindState: (arg0: string, arg1: SocketIoSharedDoc) => void;
    writeState: (arg0: string, arg1: SocketIoSharedDoc) => Promise<any>;
    provider: any;
  } | null
) => {
  persistence = persistence_;
};

export const getPersistence = (): null | {
  bindState: (arg0: string, arg1: SocketIoSharedDoc) => void;
  writeState: (arg0: string, arg1: SocketIoSharedDoc) => Promise<any>;
} | null => persistence;

// exporting docs so that others can use it
export const docs: Map<string, SocketIoSharedDoc> = new Map();

export const messageSync = 0;
export const messageAwareness = 1;

const updateHandler = (
  update: Uint8Array,
  origin: any,
  doc: SocketIoSharedDoc
) => {
  const encoder = encoding.createEncoder();
  encoding.writeVarUint(encoder, messageSync);
  syncProtocol.writeUpdate(encoder, update);
  const message = encoding.toUint8Array(encoder);
  doc.conns.forEach((_, conn) => send(doc, conn, message));
};

class SocketIoSharedDoc extends Y.Doc {
  name: string;
  mux: mutex.mutex;
  conns: Map<Socket, Set<number>>;
  awareness: awarenessProtocol.Awareness;

  constructor(name: string) {
    super({ gc: gcEnabled });
    this.name = name;
    this.mux = mutex.createMutex();

    this.conns = new Map();

    this.awareness = new awarenessProtocol.Awareness(this);
    this.awareness.setLocalState(null);

    const awarenessChangeHandler = (
      {
        added,
        updated,
        removed,
      }: {
        added: Array<number>;
        updated: Array<number>;
        removed: Array<number>;
      },
      conn: Socket | null
    ) => {
      const changedClients = added.concat(updated, removed);
      if (conn !== null) {
        const connControlledIDs = this.conns.get(conn);
        if (connControlledIDs !== undefined) {
          added.forEach((clientID) => {
            connControlledIDs.add(clientID);
          });
          removed.forEach((clientID) => {
            connControlledIDs.delete(clientID);
          });
        }
      }
      // broadcast awareness update
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, messageAwareness);
      encoding.writeVarUint8Array(
        encoder,
        awarenessProtocol.encodeAwarenessUpdate(this.awareness, changedClients)
      );
      const buff = encoding.toUint8Array(encoder);
      this.conns.forEach((_, c) => {
        send(this, c, buff);
      });
    };
    this.awareness.on("update", awarenessChangeHandler);
    this.on("update", updateHandler);
  }
}

export const getYDoc = (
  docname: string,
  gc: boolean = true
): SocketIoSharedDoc =>
  map.setIfUndefined(docs, docname, () => {
    const doc = new SocketIoSharedDoc(docname);
    doc.gc = gc;
    if (persistence !== null) {
      persistence.bindState(docname, doc);
    }
    docs.set(docname, doc);
    return doc;
  });

export const messageListener = (
  conn: Socket,
  doc: SocketIoSharedDoc,
  message: Uint8Array
) => {
  const encoder = encoding.createEncoder();
  const decoder = decoding.createDecoder(message);
  const messageType = decoding.readVarUint(decoder);
  switch (messageType) {
    case messageSync:
      encoding.writeVarUint(encoder, messageSync);
      syncProtocol.readSyncMessage(decoder, encoder, doc, null);
      if (encoding.length(encoder) > 1) {
        send(doc, conn, encoding.toUint8Array(encoder));
      }
      break;
    case messageAwareness: {
      awarenessProtocol.applyAwarenessUpdate(
        doc.awareness,
        decoding.readVarUint8Array(decoder),
        conn
      );
      break;
    }
  }
};

export const closeConn = (doc: SocketIoSharedDoc, conn: Socket) => {
  if (doc.conns.has(conn)) {
    const controlledIds = doc.conns.get(conn);
    doc.conns.delete(conn);
    awarenessProtocol.removeAwarenessStates(
      doc.awareness,
      Array.from(controlledIds),
      null
    );
    if (doc.conns.size === 0 && persistence !== null) {
      // if persisted, we store state and destroy ydocument
      persistence.writeState(doc.name, doc).then(() => {
        doc.destroy();
      });
      docs.delete(doc.name);
    }
  }
  conn.disconnect();
};

export const send = (
  doc: SocketIoSharedDoc,
  conn: Socket,
  message: Uint8Array
) => {
  if (conn.disconnected) {
    closeConn(doc, conn);
  }

  const base64Encoded = fromUint8Array(message);
  try {
    conn.emit("collaboration", base64Encoded);
  } catch (e) {
    closeConn(doc, conn);
  }
};
