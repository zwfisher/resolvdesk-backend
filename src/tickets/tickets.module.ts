import {Module} from "@nestjs/common";
import {DrizzleService} from "../database/drizzle.service";
import {TicketsRepository} from "./tickets.repository";
import {TicketsService} from "./tickets.service";
import {TicketsController} from "./tickets.controller";

@Module({
  imports: [DrizzleService],
  controllers: [TicketsController],
  providers: [TicketsRepository, TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}