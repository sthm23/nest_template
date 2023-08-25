import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { PayloadData } from '../interface/interfaces';
import {Request, Response} from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken()
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_KEY,
    });
  }

  async validate(payload: PayloadData) {
    return { userId: payload.userId, login: payload.login, role: payload.role };
  }

  private static extractJWT(req: Request): string | null {

    if (req.body.refreshToken) {
      return req.body.refreshToken;
    }
    return null;
  }
}