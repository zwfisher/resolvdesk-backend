import {Body, Controller, Delete, Get, Post, Put, Param} from "@nestjs/common";
import {TicketsService} from "./tickets.service";
import {Ticket} from "../database/schema";
import {CreateTicketDto} from "./dto/create-ticket.dto";
import {UpdateTicketDto} from "./dto/update-ticket.dto";

@Controller('tickets')
export class TicketsController {
  constructor(private ticketService: TicketsService) {}

  @Get()
  async getAllTickets(): Promise<Ticket[]> {
    return this.ticketService.getAllTickets();
  }

  @Get(':id')
  async getTicket(@Param('id') id: number): Promise<Ticket> {
    return this.ticketService.getTicketById(id);
  }

  @Post()
  async createTicket(@Body() ticket: CreateTicketDto): Promise<Ticket> {
    return this.ticketService.createTicket(ticket);
  }

  @Put(':id')
  async updateTicket(@Body() ticket: UpdateTicketDto): Promise<Ticket> {
    return this.ticketService.updateTicket(ticket);
  }

  @Delete(':id')
  async deleteTicket(@Param('id') id: number): Promise<void> {
    return this.ticketService.deleteTicket(id);
  }
}