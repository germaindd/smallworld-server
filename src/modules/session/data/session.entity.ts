import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'session' })
export class SessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  tokenId!: string;

  @Column({ type: 'timestamp with time zone' })
  expiry!: Date;
}
