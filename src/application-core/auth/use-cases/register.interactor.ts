import { BadRequestException, Injectable } from '@nestjs/common';
import { UserGateway } from '../../../infrastructure/persistence/gateways/user.gateway';
import { RegisterDto, UserType } from '../dto/register.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class RegisterInteractor {
  constructor(private readonly userGateway: UserGateway) {}

  async execute(payload: RegisterDto) {
    if (!payload.email) {
      throw new BadRequestException('Email is required');
    }

    if (!payload.password) {
      throw new BadRequestException('Password is required');
    }

    if (!payload.repeatPassword) {
      throw new BadRequestException('Repeat password is required');
    }

    if (payload.password !== payload.repeatPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const user = await this.userGateway.findOne({
      email: payload.email,
    });

    if (user) {
      throw new BadRequestException('User already exists');
    }

    const salt: string = await bcrypt.genSalt();
    payload.password = await bcrypt.hash(payload.password, salt);

    if (payload.type === UserType.DOCTOR) {
      payload.permissions = ['read:users', 'write:users'];
    }

    if (payload.type === UserType.USER || !payload.type) {
      payload.permissions = ['read:user', 'write:user'];
    }

    return this.userGateway.create(payload);
  }
}
