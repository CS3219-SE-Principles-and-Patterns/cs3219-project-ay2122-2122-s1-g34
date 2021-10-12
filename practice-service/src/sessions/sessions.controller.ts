import { Controller } from "@nestjs/common";
import { EventPattern, MessagePattern, Payload } from "@nestjs/microservices";

import { JoinSessionDto } from "./dto/join-session.dto";
import { SessionsService } from "./sessions.service";

@Controller()
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @MessagePattern("joinSession")
  join(@Payload() joinSessionDto: JoinSessionDto) {
    return this.sessionsService.join(joinSessionDto);
  }

  @MessagePattern("findOneUnclosedSession")
  findOneUnclosedSession(@Payload() userId: string) {
    return this.sessionsService.findOneUnclosedSession(userId);
  }

  /**
   * Handles a user leaving the session
   * @param userId user leaving the session
   * @param isAnotherUserInSession is there another user remaining in the session
   */
  @EventPattern("handleSessionDisconnect")
  handleSessionDisconnect(
    @Payload()
    {
      sessionId,
      isAnotherUserInSession,
    }: {
      sessionId: string;
      isAnotherUserInSession: boolean;
    }
  ) {
    return this.sessionsService.handleSessionDisconnect(
      sessionId,
      isAnotherUserInSession
    );
  }
}
