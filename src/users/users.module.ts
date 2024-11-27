import {Module} from "@nestjs/common";
import {DrizzleService} from "../database/drizzle.service";
import {UsersController} from "./users.controller";
import {UsersRepository} from "./users.repository";
import {UsersService} from "./users.service";

@Module({
  imports: [DrizzleService],
  controllers: [UsersController],
  providers: [UsersRepository, UsersService],
  exports: [UsersService],
})
export class UsersModule {}