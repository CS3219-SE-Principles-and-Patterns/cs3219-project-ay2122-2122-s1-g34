import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ChatModule } from "./chat/chat.module";
import { CodeRunnerModule } from "./code-runner/code-runner.module";
import { CollaborationModule } from "./collaboration/collaboration.module";
import { FirebaseModule } from "./firebase/firebase.module";
import { PracticeModule } from "./practice/practice.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    ChatModule,
    CodeRunnerModule,
    CollaborationModule,
    FirebaseModule,
    PracticeModule,
    UsersModule,
  ],
})
export class AppModule {}
