import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { CollaborationModule } from "./collaboration/collaboration.module";
import { FirebaseModule } from "./firebase/firebase.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    FirebaseModule,
    UsersModule,
    CollaborationModule,
  ],
})
export class AppModule {}
