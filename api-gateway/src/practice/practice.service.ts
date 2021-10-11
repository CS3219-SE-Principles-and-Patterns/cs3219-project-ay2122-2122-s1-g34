import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import * as admin from "firebase-admin";
import { map } from "rxjs";

import { JoinSessionDto } from "./dto/join-session.dto";

@Injectable()
export class PracticeService {
  constructor(@Inject("PRACTICE_SERVICE") private client: ClientProxy) {}

  joinSession(user: admin.auth.DecodedIdToken, joinSessionDto: JoinSessionDto) {
    return this.client
      .send("joinSession", {
        userId: user.uid,
        ...joinSessionDto,
      })
      .pipe(map((session) => ({ sessionId: session.id })));
  }
}
