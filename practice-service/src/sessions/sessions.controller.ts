import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { JoinSessionDto } from "./dto/join-session.dto";
import { SessionsService } from "./sessions.service";

@Controller()
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @MessagePattern("joinSession")
  join(@Payload() joinSessionDto: JoinSessionDto) {
    return this.sessionsService.join(joinSessionDto);
  }
}
