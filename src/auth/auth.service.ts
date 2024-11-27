import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {UsersService} from "../users/users.service";
import * as bcrypt from 'bcrypt';
import {RegisterDto} from "./dto/register.dto";
import {User} from "../database/schema";

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {
  }

  public async register(registrationData: RegisterDto): Promise<User> {
    const existingUser: User = await this.userService.getUserByEmail(registrationData.email);
    if (existingUser) {
      throw new BadRequestException("User already exists");
    }

    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    const createdUser = await this.userService.createUser({
      ...registrationData,
      password: hashedPassword,
    });
    createdUser.password = undefined;
    return createdUser;
  }

  public async login(email: string, password: string): Promise<User> {
    try {
      const user = await this.userService.getUserByEmail(email);
      await this.verifyPassword(password, user.password);
      user.password = undefined;
      return user;
    } catch (error) {
      throw new BadRequestException("Wrong email or password");
    }
  }

  private async verifyPassword(password: string, hashedPassword: string): Promise<void> {
    const passwordsMatch = await bcrypt.compare(password, hashedPassword);
    if (!passwordsMatch) {
      throw new BadRequestException("Wrong email or password");
    }
  }
}