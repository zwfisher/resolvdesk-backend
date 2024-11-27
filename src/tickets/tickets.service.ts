import {Injectable} from "@nestjs/common";
import {TicketsRepository} from "./tickets.repository";
import {Ticket} from "../database/schema";
import {CreateTicketDto} from "./dto/create-ticket.dto";
import {UpdateTicketDto} from "./dto/update-ticket.dto";

@Injectable()
export class TicketsService {
  constructor(private readonly ticketsRepository: TicketsRepository) {}

  getAllTickets(): Promise<Ticket[]> {
    return this.ticketsRepository.getAllTickets();
  }

  getTicketById(id: number): Promise<Ticket> {
    return this.ticketsRepository.getTicketById(id);
  }

  createTicket(ticket: CreateTicketDto): Promise<Ticket> {
    return this.ticketsRepository.createTicket(ticket);
  }

  updateTicket(ticket: UpdateTicketDto): Promise<Ticket> {
    return this.ticketsRepository.updateTicket(ticket);
  }

  deleteTicket(id: number): Promise<void> {
    return this.ticketsRepository.deleteTicket(id);
  }
}