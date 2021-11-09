import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Put,
} from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { ApiHeader, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AuthGuard } from "src/common/guards/auth.guard";

import { User } from "../common/decorators/user.decorator";
import { JoinSessionDto } from "./dto/join-session.dto";
import { PracticeDto } from "./dto/practice.dto";
import { SessionDto } from "./dto/session.dto";
import { UpdateSessionNoteDto } from "./dto/update-session-note.dto";
import { PracticeGateway } from "./practice.gateway";
import { PracticeService } from "./practice.service";

@Controller({ path: "practice", version: "1" })
@ApiHeader({ name: "token" })
@ApiResponse({ status: 401, description: "Unauthorized" })
@ApiResponse({ status: 403, description: "Forbidden" })
export class PracticeController {
  constructor(
    private readonly practiceGateway: PracticeGateway,
    private readonly practiceService: PracticeService
  ) {}

  @Post()
  @ApiResponse({
    status: 400,
    description: "Already in an existing practice session",
  })
  @ApiResponse({
    status: 201,
    description: "Successfully joined or created a practice session",
    schema: {
      example: {
        sessionId: "93e6d2cc-0be8-48bb-b42b-215cb6ac6bfc",
      },
      type: "object",
      properties: { sessionId: { type: "string" } },
    },
  })
  @ApiOperation({ summary: "Start or join a practice session" })
  @UseGuards(AuthGuard)
  joinSession(@User() user, @Body() joinSessionDto: JoinSessionDto) {
    return this.practiceService.joinSession(user, joinSessionDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: "Successfully retrieved all past attempts",
    type: [PracticeDto],
  })
  @ApiOperation({ summary: "Retrieve all past attempts" })
  @UseGuards(AuthGuard)
  findAll(@User() user) {
    return this.practiceService.findAll(user);
  }

  @Get("in-progress")
  @ApiResponse({
    status: 200,
    description: "Successfully retrieved all past attempts",
    type: [PracticeDto],
  })
  @ApiOperation({ summary: "Find session that user is " })
  @UseGuards(AuthGuard)
  findOneInProgressSessionByUser(@User() user) {
    return this.practiceService.findOneInProgressSessionByUser(user);
  }

  @Get(":sessionId")
  @ApiResponse({
    status: 200,
    description: "Successfully found a session that the user is in",
    type: SessionDto,
  })
  @ApiResponse({
    status: 404,
    description: "User is not in any session",
  })
  @ApiOperation({ summary: "Retrieve a single past attempt" })
  @UseGuards(AuthGuard)
  findOne(@User() user, @Param("sessionId") sessionId: string) {
    return this.practiceService.findOne(user, sessionId);
  }

  @Put(":sessionId")
  @ApiOperation({ summary: "Update notes" })
  @ApiResponse({
    status: 200,
    description: "Successfully updated session note",
  })
  @UseGuards(AuthGuard)
  async updateSessionNote(
    @User() user,
    @Param("sessionId") sessionId: string,
    @Body() updateSessionNoteDto: UpdateSessionNoteDto
  ) {
    await this.practiceService.updateSessionNote(
      user,
      sessionId,
      updateSessionNoteDto
    );
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
