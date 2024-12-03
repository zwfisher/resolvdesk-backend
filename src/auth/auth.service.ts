import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { User } from '../database/schema';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';

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
    const existingUser: User = await this.userService.getUserByEmail(
      registrationData.email,
    );
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await hash(registrationData.password, 10);
    const createdUser = await this.userService.createUser({
      ...registrationData,
      password: hashedPassword,
    });
    createdUser.password = undefined;
    return createdUser;
  }

  public async login(user: User): Promise<JWT> {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  public async validateUser(email: string, password: string): Promise<User> {
    const user: User = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    const passwordsMatch = await compare(password, user.password);
    if (!passwordsMatch) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
