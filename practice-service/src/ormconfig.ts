import { ConnectionOptions } from "typeorm";

import { Question } from "./questions/entities/question.entity";
import { SessionNote } from "./session-notes/entities/session-note.entity";
import { Session } from "./sessions/entities/session.entity";

const config: ConnectionOptions = {
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_USER,
  entities: [Question, Session, SessionNote],
  synchronize: false,
  migrations: [__dirname + "/migrations/**/*{.ts,.js}"],
  cli: {
    // Location of migration should be inside src folder
    // to be compiled into dist/ folder.
    migrationsDir: __dirname + "/migrations",
  },
};

export default config;
