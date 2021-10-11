import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { CreateSessionDto } from "./dto/create-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { SessionsService } from "./sessions.service";

@Controller()
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @MessagePattern("createSession")
  create(@Payload() createSessionDto: CreateSessionDto) {
    return this.sessionsService.create(createSessionDto);
  }

  @MessagePattern("findAllSessions")
  findAll() {
    return this.sessionsService.findAll();
  }

  @MessagePattern("findOneSession")
  findOne(@Payload() id: string) {
    return this.sessionsService.findOne(id);
  }

  @MessagePattern("updateSession")
  update(@Payload() updateSessionDto: UpdateSessionDto) {
    return this.sessionsService.update(updateSessionDto.id, updateSessionDto);
  }

  @MessagePattern("removeSession")
  remove(@Payload() id: string) {
    return this.sessionsService.remove(id);
  }
}
