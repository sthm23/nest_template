import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/createuser.dto';
import { AuthService } from '../service/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {Request, Response} from 'express'
import { LocalAuthGuard } from '../guards/local.guard';
import { UpdateUserPasswordDto } from '../dto/updateUserPassword';


@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {

    const token = await this.authService.login(req, res);
    return token
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  logOut(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.logOut(req, res);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  })) body: CreateUserDto) {
    return await this.authService.register(body);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('refresh')
  async refresh(@Body() body: {refreshToken:string}) {
    return await this.authService.refreshToken(body);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('refPas')
  async refreshPassword(@Req() req: Request, @Body(new ValidationPipe()) dto:UpdateUserPasswordDto) {
    return this.authService.refreshPassword(req.user, dto);
  }

}