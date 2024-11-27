import {BadRequestException, Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common";
import {UsersService} from "../users/users.service";
import * as bcrypt from 'bcrypt';
import {RegisterDto} from "./dto/register.dto";
import {User} from "../database/schema";
import {JwtService} from "@nestjs/jwt";

export interface JWT {
  access_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

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

  async login(user: any): Promise<JWT> {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  public async validateUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.userService.getUserByEmail(email);
      await this.verifyPassword(password, user.password);
      return user;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  private async verifyPassword(password: string, hashedPassword: string): Promise<void> {
    const passwordsMatch = await bcrypt.compare(password, hashedPassword);
    if (!passwordsMatch) {
      throw new BadRequestException("Wrong email or password");
    }
  }
}