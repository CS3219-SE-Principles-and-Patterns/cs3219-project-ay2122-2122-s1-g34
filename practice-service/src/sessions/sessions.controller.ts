import { Controller } from "@nestjs/common";
import { EventPattern, MessagePattern, Payload } from "@nestjs/microservices";

import { JoinSessionDto } from "./dto/join-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";
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

  @MessagePattern("findOneInProgressSession")
  findOneInProgressSession(@Payload() id: string) {
    return this.sessionsService.findOneInProgressSession(id);
  }

  @MessagePattern("updateSession")
  update(@Payload() updateSessionDto: UpdateSessionDto) {
    return this.sessionsService.update(updateSessionDto);
  }

  /**
   * Handles a user leaving the session
   * @param userId user leaving the session
   * @param isAnotherUserInSession is there another user remaining in the session
   */
  @EventPattern("handleSessionDisconnecting")
  handleSessionDisconnecting(
    @Payload()
    {
      sessionId,
      isAnotherUserInSession,
    }: {
      sessionId: string;
      isAnotherUserInSession: boolean;
    }
  ) {
    return this.sessionsService.handleSessionDisconnecting(
      sessionId,
      isAnotherUserInSession
    );
  }
}
