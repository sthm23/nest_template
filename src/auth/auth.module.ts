import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './strategy/local.strategy';

dotenv.config();

@Module({
  imports: [
    // forwardRef(() => UsersModule),
    // forwardRef(() => LoggerModule),
    UsersModule,
    PassportModule,

    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE },
    }),
  ],
  providers: [JwtStrategy, AuthService, LocalStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
