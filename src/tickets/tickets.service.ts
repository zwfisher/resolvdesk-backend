import {Injectable, NotFoundException} from "@nestjs/common";
import {DrizzleService} from "../database/drizzle.service";
import {SelectTicket, tickets} from "../database/schema";
import {eq} from "drizzle-orm";

@Injectable()
export class TicketsService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async getAllTickets() {
    return this.drizzleService.db
      .select()
      .from(tickets);
  }

  async getTicketById(id: number): Promise<SelectTicket> {
    const results = await this.drizzleService.db
      .select()
      .from(tickets)
      .where(eq(tickets.id, id));
    const ticket = results.pop();
    if (!ticket) {
      throw new NotFoundException("Ticket not found");
    }
    return ticket;
  }
}