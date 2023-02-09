import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'APP_SESSION' })
export class AppSession {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'token_id' })
  tokenId!: string;
}
