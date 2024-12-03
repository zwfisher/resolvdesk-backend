import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { DrizzleService } from '../../database/drizzle.service';
import { AuthService } from '../auth.service';
import { RegisterDto } from '../dto/register.dto';
import { User } from '../../database/schema';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('AuthService Int', () => {
  let drizzleService: DrizzleService;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    drizzleService = moduleRef.get(DrizzleService);
    authService = moduleRef.get(AuthService);
  });

  afterEach(async () => {
    await drizzleService.cleanup();
  });

  describe('register()', () => {
    const registerDto: RegisterDto = {
      email: 'johndoe@gmail.com',
      name: 'John Doe',
      password: '123456',
    };

    it('should register a new user', async () => {
      const user: User = await authService.register(registerDto);
      expect(user.email).toEqual('johndoe@gmail.com');
      expect(user.name).toEqual('John Doe');
      expect(user.password).toBeUndefined();
    });

    it('should not register an existing user', async () => {
      const user: User = await authService.register(registerDto);
      expect(authService.register(user)).rejects.toThrowError(
        new BadRequestException('User already exists'),
      );
    });
  });

  describe('login()', () => {
    const user: User = {
      id: 123,
      email: 'johndoe@gmail.com',
      password: '123456',
      name: 'John Doe',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should return an access token', async () => {
      expect(authService.login(user)).resolves.toHaveProperty('access_token');
    });
  });

  describe('validateUser()', () => {
    const registerDto: RegisterDto = {
      email: 'johndoe@gmail.com',
      name: 'John Doe',
      password: '123456',
    };

    it('should throw if user does not exist', async () => {
      expect(
        authService.validateUser('johndoe@gmail.com', '123456'),
      ).rejects.toThrow(new UnauthorizedException());
    });

    it('should throw if the password doesnt match', async () => {
      await authService.register(registerDto);
      expect(
        authService.validateUser('johndoe@gmail.com', 'wrong'),
      ).rejects.toThrow(new UnauthorizedException());
    });

    it('should return the user if user exists and passwords match', async () => {
      await authService.register(registerDto);
      const validatedUser: User = await authService.validateUser(
        'johndoe@gmail.com',
        '123456',
      );
      expect(validatedUser.email).toEqual('johndoe@gmail.com');
      expect(validatedUser.name).toEqual('John Doe');
      expect(validatedUser.createdAt).toBeInstanceOf(Date);
      expect(validatedUser.updatedAt).toBeInstanceOf(Date);
    });
  });
});
