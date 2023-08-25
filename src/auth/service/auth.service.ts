import { ForbiddenException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/services/user.service';
import { CreateUserDto } from 'src/users/dto/createuser.dto';
import { Response, Request } from 'express';
import { GetTokenOptions, PayloadDataInRefresh } from '../interface/interfaces';
import { UpdateUserPasswordDto } from '../dto/updateUserPassword';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userServ: UserService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userServ.getUserByLoginAndPassword(username);
    if(!user) return null
    const isValid = bcrypt.compareSync(pass, user.password);
    if (user && isValid) {
      return user;
    }
    return null;
  }

  async login(req: Request, res: Response) {
    const user = req.user as GetTokenOptions;
    
    const tokens = await this.getToken({id: user.id, login: user.login, role: user.role});
    res.cookie('jwt-access', tokens.accessToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 3 });
    res.cookie('jwt-refresh', tokens.refreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 30 });
    // console.log(tokens);
    return {
      role: user.role,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    };
  }

  async register(dto: CreateUserDto) {
    return await this.userServ.createUser(dto);
  }

  async checkToken(token: string) {
    const payload:PayloadDataInRefresh = await this.jwtService
    .verifyAsync(token, {
      secret: process.env.JWT_KEY,
    })
    .catch(() => {
        throw new UnauthorizedException()
    });

    return payload;
  }

  async refreshToken(body: {refreshToken:string}) {

    const payload = await this.checkToken(body.refreshToken);
    const tokens = await this.getToken({id:payload.userId, login:payload.login, role:payload.role}, body.refreshToken)
    return tokens
  }

  async getToken({id, login, role}: GetTokenOptions, rfCheck?:string) {
    const [at, rt] = await Promise.all([
        this.jwtService.sign({
            userId: id,
            login: login,
            role: role
        }, {
            secret: process.env.JWT_KEY,
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
            // expiresIn: '5s',
        }),
        this.jwtService.sign({
          userId: id,
          login: login,
          role: role
        }, {
            secret: process.env.JWT_KEY_REFRESH,
            expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
            // expiresIn: '15s',
        })
    ]);

    if(rfCheck) {
      return {
        role: role,
        accessToken: at,
        refreshToken: rfCheck
      }
    }

    return {
        role: role,
        accessToken: at,
        refreshToken: rt
    }
  }

  async refreshPassword(user: any, body:UpdateUserPasswordDto) {
    const {userId} = user;
    const userUpdPas = await this.userServ.updateUserPassword(userId, body);
    return {
      "statusCode": HttpStatus.CREATED,
      "message": "Password successfully updated"
    }
  }

  async logOut(req:Request, res: Response) {
    res.clearCookie('jwt-access');
    res.clearCookie('jwt-refresh');
    return true
  }
}