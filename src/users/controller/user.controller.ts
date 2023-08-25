import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { Delete, Patch } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import RoleGuard from 'src/auth/guards/role.guard';
import { CreateUserDto } from '../dto/createuser.dto';
import { UpdateUserDto, UpdateUserPasswordDto, UpdateUserStatusDto } from '../dto/updateUser.dto';
import { Role } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';

@UseGuards(JwtAuthGuard)
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(RoleGuard(Role.Admin))
  @Get()
  getUsers() {
    return this.userService.getAllUsers();
  }

  @UseGuards(RoleGuard(Role.Admin))
  @Get(':id')
  getOneUser(@Param('id', new ParseUUIDPipe()) id:string) {
    return this.userService.getOneUser(id);
  }


  @UseGuards(RoleGuard(Role.Admin))
  @Post()
  createUser(@Body(new ValidationPipe()) dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @Put(':id')
  updateUserPassword(
    @Param('id', new ParseUUIDPipe()) id:string,
    @Body(new ValidationPipe()) dto: UpdateUserPasswordDto
  ) {
    return this.userService.updateUserPassword(id, dto);
  }

  @UseGuards(RoleGuard(Role.Admin))
  @Put('refresh/:id')
  refreshUserPassword(
    @Param('id', new ParseUUIDPipe()) id:string,
    @Body(new ValidationPipe()) dto: {password: string}
  ) {
    return this.userService.refreshUserPassword(id, dto);
  }

  @UseGuards(RoleGuard(Role.Admin))
  @Patch(':id')
  updateUsers(@Param('id', new ParseUUIDPipe()) id:string, @Body(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  })) dto: UpdateUserDto) {
    return this.userService.updateUserInfo(id, dto);
  }

  @UseGuards(RoleGuard(Role.Admin))
  @Patch('status/:id')
  updateUserStatus(
    @Param('id', new ParseUUIDPipe()) id:string, 
    @Body(new ValidationPipe()) dto: UpdateUserStatusDto
  ) {
    return this.userService.updateUserStatus(id, dto);
  }

  @UseGuards(RoleGuard(Role.Admin))
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.userService.deleteUser(id);
  }
}