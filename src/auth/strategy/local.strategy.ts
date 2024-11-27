import {Injectable} from "@nestjs/common";
import {Strategy} from "passport-local";
import {PassportStrategy} from "@nestjs/passport";
import {AuthService} from "../auth.service";
import {User} from "../../database/schema";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<User> {
    return this.authService.validateUser(email, password);
  }
}