import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { UpdateSessionNoteDto } from "./dto/update-session-note.dto";
import { SessionNotesService } from "./session-notes.service";

@Controller()
export class SessionNotesController {
  constructor(private readonly sessionNotesService: SessionNotesService) {}

  @MessagePattern("updateSessionNote")
  updateSessionNote(@Payload() updateSessionNoteDto: UpdateSessionNoteDto) {
    return this.sessionNotesService.updateSessionNote(updateSessionNoteDto);
  }
}
