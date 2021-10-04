import { Module } from "@nestjs/common";
import { FirebaseService } from "src/firebase/firebase.service";

import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
