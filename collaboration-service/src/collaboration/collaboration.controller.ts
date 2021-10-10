import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";

import { CollaborationService } from "./collaboration.service";
import { CollaborationPayload } from "./interfaces/collaboration-payload.interface";

@Controller()
export class CollaborationController {
  constructor(private readonly collaborationService: CollaborationService) {}

  @EventPattern("collaboration:connected")
  handleConnection(payload: CollaborationPayload) {
    this.collaborationService.handleConnection(payload);
  }

  @EventPattern("collaboration:disconnected")
  handleDisconnect(payload: CollaborationPayload) {
    this.collaborationService.handleDisconnect(payload);
  }

  @EventPattern("collaboration:message")
  handleCollaboration(payload: CollaborationPayload) {
    this.collaborationService.handleCollaboration(payload);
  }
}
