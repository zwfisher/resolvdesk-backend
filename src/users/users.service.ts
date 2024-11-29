import {Injectable} from "@nestjs/common";
import {UsersRepository} from "./users.repository";
import {CreateUserDto} from "./dto/create-user.dto";
import {User} from "../database/schema";

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  getUserByEmail(email: string): Promise<any> {
    return this.usersRepository.getUserByEmail(email);
  }

  createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.createUser(createUserDto);
  }
}