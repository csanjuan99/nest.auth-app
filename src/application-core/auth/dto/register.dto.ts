import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'jonh@doe.com',
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    example: '*********',
  })
  @IsString()
  password: string;
  @ApiProperty({
    example: '*********',
  })
  @IsString()
  repeatPassword: string;
  @ApiProperty()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'USER or DOCTOR',
  })
  type?: UserType;
  permissions?: string[];
}

export enum UserType {
  DOCTOR = 'DOCTOR',
  USER = 'USER',
}
