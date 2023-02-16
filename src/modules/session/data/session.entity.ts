import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AppSession {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  tokenId!: string;

  @Column({ type: 'timestamp with time zone' })
  expiry!: Date;
}
