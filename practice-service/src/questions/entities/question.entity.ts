import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Question {
  @PrimaryColumn("uuid")
  id: string;

  @Column()
  questionHtml: string;

  @Column()
  answer: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
