import { BadRequestException, Injectable } from '@nestjs/common';
import { UserGateway } from '../../../infrastructure/persistence/gateways/user.gateway';
import { LoginDto } from '../dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { UserDocument } from '../../../infrastructure/persistence/schemas/user.schema';
import { JwtDto } from '../dto/jwt.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginInteractor {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userGateway: UserGateway,
  ) {}

  async execute(payload: LoginDto): Promise<JwtDto> {
    if (!payload.email) {
      throw new BadRequestException('Email is required');
    }
    if (!payload.password) {
      throw new BadRequestException('Password is required');
    }
    const user: UserDocument = await this.userGateway.findOne({
      email: payload.email,
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isPasswordValid: boolean = await bcrypt.compare(
      payload.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }
    const access_token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      permissions: user.permissions,
    });
    return { access_token };
  }
}
