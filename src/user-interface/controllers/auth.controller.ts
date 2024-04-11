import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Public } from '../../application-core/auth/decorators/public.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginInteractor } from '../../application-core/auth/use-cases/login.interactor';
import { LoginDto } from '../../application-core/auth/dto/login.dto';
import { JwtDto } from '../../application-core/auth/dto/jwt.dto';
import { Request } from 'express';
import { RegisterInteractor } from '../../application-core/auth/use-cases/register.interactor';
import { RegisterDto } from '../../application-core/auth/dto/register.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginInteractor: LoginInteractor,
    private readonly registerInteractor: RegisterInteractor,
  ) {}

  @ApiOkResponse({
    description: 'Succesfully JWT Token generated',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Email is required',
  })
  @ApiBadRequestResponse({
    description: 'Password is required',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid password',
  })
  @ApiNotFoundResponse({
    description: 'User not exist',
  })
  @Public()
  @Post('login')
  async login(@Body() payload: LoginDto): Promise<JwtDto> {
    return this.loginInteractor.execute(payload);
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @Get('user')
  async user(@Req() req: Request): Promise<Express.User> {
    return req.user;
  }

  @Public()
  @ApiOkResponse({
    description: 'User registered',
  })
  @ApiBadRequestResponse({
    description: 'Email, password and repeat password are required',
  })
  @ApiBadRequestResponse({
    description: 'User already exists',
  })
  @Post('register')
  async register(@Body() payload: RegisterDto): Promise<any> {
    return this.registerInteractor.execute(payload);
  }
}
