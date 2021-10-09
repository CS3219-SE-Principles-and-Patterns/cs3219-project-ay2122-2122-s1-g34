import { Injectable } from "@nestjs/common";
import { toUint8Array } from "js-base64";
import * as encoding from "lib0/encoding";
import { Socket } from "socket.io";
import * as awarenessProtocol from "y-protocols/awareness";
import * as syncProtocol from "y-protocols/sync";

import {
  closeConn,
  getYDoc,
  messageAwareness,
  messageListener,
  messageSync,
  send,
} from "./socket-io-shared-doc.class";

@Injectable()
export class SocketService {
  handleConnection(client: Socket) {
    client.join("monacco");
    const doc = getYDoc("monacco");
    doc.conns.set(client, new Set());

    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, messageSync);
    syncProtocol.writeSyncStep1(encoder, doc);
    send(doc, client, encoding.toUint8Array(encoder));
    const awarenessStates = doc.awareness.getStates();
    if (awarenessStates.size > 0) {
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, messageAwareness);
      encoding.writeVarUint8Array(
        encoder,
        awarenessProtocol.encodeAwarenessUpdate(
          doc.awareness,
          Array.from(awarenessStates.keys())
        )
      );
      send(doc, client, encoding.toUint8Array(encoder));
    }
  }

  handleDisconnect(client: Socket) {
    const doc = getYDoc("monacco");
    closeConn(doc, client);
  }

  handleCollaboration(client: Socket, data: string) {
    const doc = getYDoc("monacco");
    messageListener(client, doc, toUint8Array(data));
  }
}
