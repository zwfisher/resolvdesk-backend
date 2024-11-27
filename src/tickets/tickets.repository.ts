import {Injectable, NotFoundException} from "@nestjs/common";
import {DrizzleService} from "../database/drizzle.service";
import {Ticket, tickets} from "../database/schema";
import {eq} from "drizzle-orm";
import {CreateTicketDto} from "./dto/create-ticket.dto";
import {UpdateTicketDto} from "./dto/update-ticket.dto";

@Injectable()
export class TicketsRepository {
  constructor(private readonly drizzleService: DrizzleService) {}

  async getAllTickets(): Promise<Ticket[]> {
    return this.drizzleService.db
      .select()
      .from(tickets);
  }

  async getTicketById(id: number): Promise<Ticket> {
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

  async createTicket(ticket: CreateTicketDto): Promise<Ticket> {
    const result = await this.drizzleService.db
      .insert(tickets)
      .values(ticket)
      .returning();

    return result.pop();
  }

  async updateTicket(ticket: UpdateTicketDto): Promise<Ticket> {
    const result = await this.drizzleService.db
      .update(tickets)
      .set(ticket)
      .where(eq(tickets.id, ticket.id))
      .returning();

    return result.pop();
  }

  async deleteTicket(id: number): Promise<void> {
    const result = await this.drizzleService.db
      .delete(tickets)
      .where(eq(tickets.id, id));
  }
}