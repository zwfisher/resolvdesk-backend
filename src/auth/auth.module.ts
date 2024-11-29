import {Module} from "@nestjs/common";
import {JwtModule} from "@nestjs/jwt";
import {UsersModule} from "../users/users.module";
import {UsersService} from "../users/users.service";
import {AuthService} from "./auth.service";
import {UsersController} from "../users/users.controller";
import {AuthController} from "./auth.controller";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {PassportModule} from "@nestjs/passport";
import {LocalStrategy} from "./strategy/local.strategy";
import {JwtStrategy} from "./strategy/jwt.strategy";
import {APP_GUARD} from "@nestjs/core";
import {JwtAuthGuard} from "./guard/jwt-auth.guard";

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
        }
      }),
    })
  ],
  providers: [
    AuthService,
    LocalStrategy,
    {
      provide: APP_GUARD,
      useValue: JwtAuthGuard
    }
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}