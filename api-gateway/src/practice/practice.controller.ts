import { Controller, Post, Body, UseGuards, Get } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { ApiHeader } from "@nestjs/swagger";
import { AuthGuard } from "src/common/guards/auth.guard";

import { User } from "../common/decorators/user.decorator";
import { JoinSessionDto } from "./dto/join-session.dto";
import { PracticeGateway } from "./practice.gateway";
import { PracticeService } from "./practice.service";

@Controller({ path: "practice", version: "1" })
@ApiHeader({ name: "token" })
export class PracticeController {
  constructor(
    private readonly practiceGateway: PracticeGateway,
    private readonly practiceService: PracticeService
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  joinSession(@User() user, @Body() joinSessionDto: JoinSessionDto) {
    return this.practiceService.joinSession(user, joinSessionDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@User() user) {
    return this.practiceService.findAll(user);
  }

  @EventPattern("session:started")
  handleSessionStarted(sessionId: string) {
    return this.practiceService.handleSessionStarted(
      sessionId,
      this.practiceGateway.server
    );
  }

  @EventPattern("session:removed")
  handleSessionRemoved(sessionId: string) {
    return this.practiceService.handleSessionRemoved(
      sessionId,
      this.practiceGateway.server
    );
  }
}
