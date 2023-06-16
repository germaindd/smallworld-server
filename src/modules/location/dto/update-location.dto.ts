import { IsNumber } from 'class-validator';

export class UpdateLocationDto {
  @IsNumber()
  longitude!: number;
  @IsNumber()
  latitude!: number;
}
