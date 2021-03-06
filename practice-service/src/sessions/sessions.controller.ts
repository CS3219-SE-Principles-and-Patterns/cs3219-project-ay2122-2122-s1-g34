import { Controller } from "@nestjs/common";
import { EventPattern, MessagePattern, Payload } from "@nestjs/microservices";

import { CheckSessionAnswerDto } from "./dto/check-session-answer.dto";
import { FindOneSessionDto } from "./dto/find-one-session.dto";
import { HandleSessionDisconnectingDto } from "./dto/handle-session-disconnecting.dto";
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

  @MessagePattern("findAllClosedSessions")
  findAllClosedSessions(@Payload() userId: string) {
    return this.sessionsService.findAllClosedSessions(userId);
  }

  @MessagePattern("findOneClosedSession")
  findOneClosedSession(@Payload() findOneSessionDto: FindOneSessionDto) {
    return this.sessionsService.findOneClosedSession(findOneSessionDto);
  }

  @MessagePattern("findOneUnclosedSession")
  findOneUnclosedSession(@Payload() userId: string) {
    return this.sessionsService.findOneUnclosedSession(userId);
  }

  @MessagePattern("findOneInProgressSessionByUser")
  findOneInProgressSessionByUser(@Payload() userId: string) {
    return this.sessionsService.findOneInProgressSessionByUser(userId);
  }

  @MessagePattern("findOneInProgressSession")
  findOneInProgressSession(@Payload() id: string) {
    return this.sessionsService.findOneInProgressSession(id);
  }

  @MessagePattern("updateSession")
  update(@Payload() updateSessionDto: UpdateSessionDto) {
    return this.sessionsService.update(updateSessionDto);
  }

  @MessagePattern("checkSessionAnswer")
  checkAnswer(@Payload() checkSessionAnswerDto: CheckSessionAnswerDto) {
    return this.sessionsService.checkAnswer(checkSessionAnswerDto);
  }

  /**
   * Handles a user leaving the session
   * @param userId user leaving the session
   * @param isAnotherUserInSession is there another user remaining in the session
   */
  @EventPattern("handleSessionDisconnecting")
  handleSessionDisconnecting(
    @Payload() handleSessionDisconnectingDto: HandleSessionDisconnectingDto
  ) {
    return this.sessionsService.handleSessionDisconnecting(
      handleSessionDisconnectingDto
    );
  }
}
