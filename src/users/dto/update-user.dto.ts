import {IsString} from "class-validator";

export class UpdateUserDto {
  @IsString()
  email: string;

  @IsString()
  name: string;

  @IsString()
  password: string;
}