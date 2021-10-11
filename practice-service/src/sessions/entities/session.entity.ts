import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { Difficulty, Question } from "../../questions/entities/question.entity";

enum Status {
  Open = "open",
  InProgress = "in-progress",
  Closed = "closed",
}

@Entity()
export class Session {
  @PrimaryColumn("uuid")
  id: string;

  // only 2 users are allowed per session. whitelisted user ids will be added to this array
  @Column("varchar", { array: true })
  allowedUserIds: string[];

  @Column({
    type: "enum",
    enum: Difficulty,
  })
  difficulty: Difficulty;

  @ManyToOne(() => Question, { nullable: false })
  question: Question;

  @Column({ type: "enum", enum: Status, default: Status.Open })
  status: Status;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
