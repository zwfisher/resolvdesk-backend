import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../database/drizzle.service';
import { User, users } from '../database/schema';
import { CreateUserDto } from './dto/create-user.dto';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersRepository {
  constructor(private readonly drizzleService: DrizzleService) {}

  async getAllUsers(): Promise<User[]> {
    return this.drizzleService.db.select().from(users);
  }

  async getUserByEmail(email: string): Promise<User> {
    const results = await this.drizzleService.db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return results.pop();
  }

  async createUser(user: CreateUserDto): Promise<User> {
    const now = new Date();
    const results = await this.drizzleService.db
      .insert(users)
      .values({
        email: user.email,
        name: user.name,
        password: user.password,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return results.pop();
  }
}
