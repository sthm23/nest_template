import { IsNotEmpty, IsString, IsEnum, IsOptional, IsArray, ArrayNotEmpty, ArrayMinSize, IsNumber } from 'class-validator';
import { UserStatus } from '../interfaces/user.interface';

export class UpdateUserPasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

export class UpdateUserDto {

  @IsNotEmpty()
  @IsString()
  login: string;

  @IsOptional() 
  @IsString()
  role: string;

  @IsOptional() 
  @IsString()
  region: string;

  @IsOptional() 
  @IsString()
  phoneNumber: string;

  @IsOptional() 
  @IsString()
  email: string;

  @IsOptional() 
  @IsString()
  name: string;
  
  @IsOptional() 
  @IsEnum(UserStatus)
  status: string;
}

export class UpdateUserStatusDto {

  @IsNotEmpty() 
  @IsEnum(UserStatus)
  status: string;
}