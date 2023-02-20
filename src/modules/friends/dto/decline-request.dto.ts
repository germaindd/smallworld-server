import { IsUUID } from 'class-validator';

export class DeclineRequestDto {
  @IsUUID()
  userId!: string;
}
