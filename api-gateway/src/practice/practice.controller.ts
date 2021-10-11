import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { ApiHeader } from "@nestjs/swagger";
import { AuthGuard } from "src/common/guards/auth.guard";

import { User } from "../common/decorators/user.decorator";
import { JoinSessionDto } from "./dto/join-session.dto";
import { PracticeService } from "./practice.service";

@Controller({ path: "practice", version: "1" })
@ApiHeader({ name: "token" })
@UseGuards(AuthGuard)
export class PracticeController {
  constructor(private readonly practiceService: PracticeService) {}

  @Post()
  joinSession(@User() user, @Body() joinSessionDto: JoinSessionDto) {
    return this.practiceService.joinSession(user, joinSessionDto);
  }
}
