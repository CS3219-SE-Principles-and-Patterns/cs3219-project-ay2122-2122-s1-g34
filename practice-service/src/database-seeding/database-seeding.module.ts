import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Question } from "src/questions/entities/question.entity";

import ormconfig from "../ormconfig";
import { DatabaseSeedingService } from "./database-seeding.service";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(ormconfig),
    TypeOrmModule.forFeature([Question]),
  ],
  providers: [DatabaseSeedingService],
})
export class DatabaseSeedingModule {}
