import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { toUint8Array } from "js-base64";
import * as encoding from "lib0/encoding";
import * as awarenessProtocol from "y-protocols/awareness";
import * as syncProtocol from "y-protocols/sync";

import { CollaborationPayload } from "./interfaces/collaboration-payload.interface";
import {
  closeConn,
  getYDoc,
  messageAwareness,
  messageListener,
  messageSync,
  send,
} from "./socket-io-shared-doc.class";

@Injectable()
export class CollaborationService {
  constructor(@Inject("API_GATEWAY_SERVICE") private client: ClientProxy) {}

  handleConnection(payload: CollaborationPayload) {
    const { roomName, socketId } = payload;

    const doc = getYDoc(roomName, this.client);
    doc.conns.set(socketId, new Set());

    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, messageSync);
    syncProtocol.writeSyncStep1(encoder, doc);
    send(doc, socketId, encoding.toUint8Array(encoder));

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
      send(doc, socketId, encoding.toUint8Array(encoder));
    }
  }

  handleDisconnecting(payload: CollaborationPayload) {
    const { roomName, socketId } = payload;
    const doc = getYDoc(roomName, this.client);
    closeConn(doc, socketId);
  }

  handleCollaboration(payload: CollaborationPayload) {
    const { roomName, socketId, message } = payload;
    const doc = getYDoc(roomName, this.client);
    messageListener(socketId, doc, toUint8Array(message));
  }
}
