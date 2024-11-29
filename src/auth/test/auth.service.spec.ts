import { AuthService } from '../auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../users/users.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { User } from '../../database/schema';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../dto/register.dto';
import { JwtService } from '@nestjs/jwt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: DeepMocked<UsersService>;
  let jwtService: DeepMocked<JwtService>;
  let registeredUser: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker(createMock)
      .compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);

    registeredUser = {
      id: 1,
      email: 'johndoe@gmail.com',
      name: 'John Doe',
      password: 'hashed',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  describe('register', () => {
    let registerDto: RegisterDto;

    beforeEach(async () => {
      registerDto = {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: '123456',
      };

      (bcrypt.hash as jest.Mock) = jest
        .fn()
        .mockImplementation(() => Promise.resolve('hashed'));
    });

    it('should register user that does not exist', async () => {
      // we dont have the user, so return undefined
      usersService.getUserByEmail.mockImplementation(() => {
        return Promise.resolve(undefined);
      });
      // register the user after hashing the password
      usersService.createUser.mockImplementation(() => {
        return Promise.resolve(registeredUser);
      });

      // it should return the new user with an undefined password
      expect(authService.register(registerDto)).resolves.toEqual({
        ...registeredUser,
        password: undefined,
      });
    });

    it('should not register user that already exists', async () => {
      usersService.getUserByEmail.mockImplementation(() => {
        return Promise.resolve(registeredUser);
      });

      expect(authService.register(registerDto)).rejects.toThrowError(
        new BadRequestException('User already exists'),
      );
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      // sign the jwt
      jwtService.sign.mockImplementation((payload) => {
        return 'signed_payload';
      });

      expect(authService.login(registeredUser)).resolves.toEqual({
        access_token: 'signed_payload',
      });
    });
  });

  describe('validateUser', () => {
    it('should return the user if passwords match', async () => {
      // the user does exist
      usersService.getUserByEmail.mockImplementation(() => {
        return Promise.resolve(registeredUser);
      });
      // mock that passwords match
      (bcrypt.compare as jest.Mock) = jest
        .fn()
        .mockImplementation(() => Promise.resolve(true));

      expect(
        authService.validateUser(registeredUser.email, registeredUser.password),
      ).resolves.toEqual(registeredUser);
    });

    it('should throw a 401 if the user doesnt exist', async () => {
      // the user does not exist
      usersService.getUserByEmail.mockImplementation(() => {
        return Promise.resolve(undefined);
      });

      expect(
        authService.validateUser(registeredUser.email, registeredUser.password),
      ).rejects.toEqual(new UnauthorizedException());
    });

    it('should throw a 401 if the user exists, but passwords dont match', async () => {
      // the user does exist
      usersService.getUserByEmail.mockImplementation(() => {
        return Promise.resolve(registeredUser);
      });

      // mock that passwords don't match
      (bcrypt.compare as jest.Mock) = jest
        .fn()
        .mockImplementation(() => Promise.resolve(false));

      expect(
        authService.validateUser(registeredUser.email, registeredUser.password),
      ).rejects.toEqual(new UnauthorizedException());
    });
  });
});
