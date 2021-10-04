import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { CatsModule } from "./cats/cats.module";

@Module({
  imports: [ConfigModule.forRoot(), CatsModule],
})
export class AppModule {}
