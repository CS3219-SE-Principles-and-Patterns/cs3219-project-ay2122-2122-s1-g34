import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

export enum Difficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

@Entity()
export class Question {
  @PrimaryColumn("uuid")
  id: string;

  @Column()
  answer: string;

  @Column({
    type: "enum",
    enum: Difficulty,
  })
  difficulty: Difficulty;

  @Column()
  questionHtml: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
