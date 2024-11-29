import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService, JWT } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { Public } from './public.decorator';
import { RegisterDto } from './dto/register.dto';
import { User } from '../database/schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  register(@Body() registerDto: RegisterDto): Promise<User> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  logIn(@Request() req): Promise<JWT> {
    return this.authService.login(req.user as User);
  }
}
