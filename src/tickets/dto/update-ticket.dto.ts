import {IsNumber, IsString} from "class-validator";

export class UpdateTicketDto {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsString()
  description: string;
}