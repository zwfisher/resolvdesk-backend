import {IsEmail, IsString, IsStrongPassword} from "class-validator";

export class CreateUserDto {
  @IsEmail()
  email: string;
  @IsString()
  name: string;
  @IsString()
  password: string;
}