import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Difficulty, Question } from "../../questions/entities/question.entity";

export enum Status {
  Open = "open", // open with one user waiting for another to join
  InProgress = "in-progress", // 2 users currently partaking in the session
  Closed = "closed", // session has ended
}

@Entity()
export class Session {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // only 2 users are allowed per session. whitelisted user ids will be added to this array
  @Column("varchar", { array: true })
  allowedUserIds: string[];

  @Column({
    type: "enum",
    enum: Difficulty,
  })
  difficulty: Difficulty;

  @ManyToOne(() => Question)
  question: Question;

  @Column({ type: "enum", enum: Status, default: Status.Open })
  status: Status;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
