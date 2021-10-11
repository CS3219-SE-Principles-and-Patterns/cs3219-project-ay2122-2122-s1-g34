import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import ormconfig from "./ormconfig";
import { QuestionsModule } from "./questions/questions.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(ormconfig),
    QuestionsModule,
  ],
})
export class AppModule {}
