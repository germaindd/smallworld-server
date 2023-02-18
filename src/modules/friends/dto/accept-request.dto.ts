import { IsUUID } from 'class-validator';

export class AcceptRequestDto {
  @IsUUID()
  userId!: string;
}
