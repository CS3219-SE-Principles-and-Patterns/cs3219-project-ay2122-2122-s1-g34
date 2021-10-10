import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { CollaborationModule } from "./collaboration/collaboration.module";

@Module({
  imports: [CollaborationModule],
})
export class AppModule {}
