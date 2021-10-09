import { string } from "lib0";

export interface CollaborationPayload {
  socketId: string;
  message: string;
  roomName: string;
}
