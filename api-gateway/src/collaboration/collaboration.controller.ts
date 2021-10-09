import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";

import { CollaborationGateway } from "./collaboration.gateway";
import { CollaborationService } from "./collaboration.service";
import { CollaborationPayload } from "./interfaces/collaboration-payload.interface";

@Controller()
export class CollaborationController {
  constructor(
    private readonly collaborationGateway: CollaborationGateway,
    private readonly collaborationService: CollaborationService
  ) {}

  @EventPattern("collaboration:send")
  handleSend(payload: CollaborationPayload) {
    this.collaborationService.handleSend(
      payload,
      this.collaborationGateway.server
    );
  }
}
