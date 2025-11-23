import { IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateChargingDto {
  @IsString()
  type: string;

  @IsNumber()
  liters: number;

  @IsNumber()
  pricePerLiter: number;

  @IsNumber()
  total: number;

  @IsDateString()
  date: string; 
}
