import * as dotenv from "dotenv";
import * as fs from "fs";
import { ConnectionOptions } from "typeorm";

import { Question } from "./questions/entities/question.entity";
import { Session } from "./sessions/entities/session.entity";

const data = dotenv.parse(fs.readFileSync(".env"));

const config: ConnectionOptions = {
  type: "postgres",
  host: data.POSTGRES_HOST,
  port: +data.POSTGRES_PORT,
  username: data.POSTGRES_USER,
  password: data.POSTGRES_PASSWORD,
  database: data.POSTGRES_USER,
  entities: [Question, Session],
  synchronize: true,
  migrations: [__dirname + "/migrations/**/*{.ts,.js}"],
  cli: {
    // Location of migration should be inside src folder
    // to be compiled into dist/ folder.
    migrationsDir: __dirname + "/migrations",
  },
  // Automatically run migrations
  migrationsRun: true,
};

export default config;
