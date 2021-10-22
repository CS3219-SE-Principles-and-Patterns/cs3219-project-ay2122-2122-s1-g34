import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { Session } from "../../sessions/entities/session.entity";

@Entity()
export class SessionNote {
  @PrimaryColumn()
  userId: string;

  @ManyToOne(() => Session, (session) => session.notes, { primary: true })
  session: Session;

  @Column()
  note: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
