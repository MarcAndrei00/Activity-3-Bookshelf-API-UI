import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ default: 'Unknown' })
  author: string;

  @Column({ nullable: true })
  category: string;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @Column({ nullable: true })
  image: string;

  @Column({ default: false })
  completed: boolean;
}
