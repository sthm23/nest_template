import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/createuser.dto';
import { UpdateUserDto, UpdateUserPasswordDto, UpdateUserStatusDto } from '../dto/updateUser.dto';
import { UserEntity } from '../entities/user.entity';
import { UserStatus } from '../interfaces/user.interface';


@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private userRepo: Repository<UserEntity>
    ) {}

    async getAllUsers(): Promise<UserEntity[]> {
        return this.userRepo.find();
    }

    async getOneUser(id: string): Promise<UserEntity> {
        const user = await this.userRepo.findOne({
            where: {id}
         });
        if(user) {
            return user;
        }
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    async getUserByLoginAndPassword(login: string) {
        const user = await this.userRepo.findOne({where: {
            login,
        }});

        if(!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        if(user.status === UserStatus.DeActive) {
            throw new HttpException('User profile inactive', HttpStatus.NOT_FOUND);
        }

        return user;
    }

    async createUser(dto:CreateUserDto) {
        const userCheck = await this.userRepo.findOne({where: {
            login: dto.login,
        }});
        if(userCheck) {
            throw new HttpException('User already exist', HttpStatus.BAD_REQUEST);
        }
        const newUser = new UserEntity();
        const salt = bcrypt.genSaltSync(10);
        newUser.password = bcrypt.hashSync(dto.password, salt);
        newUser.login = dto.login
        newUser.role = dto.role
        newUser.region = dto.region
        newUser.phoneNumber = dto.phoneNumber
        newUser.email = dto.email
        newUser.name = dto.name
        newUser.status = dto.status
        return await this.userRepo.save(newUser);
    }

    async updateUserPassword(id: string, dto: UpdateUserPasswordDto) {
        const user = await this.userRepo.findOne({where: {id}});

        if(!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND); 
        }
        const isValid = bcrypt.compareSync(dto.oldPassword, user.password);
        if(!isValid) {
            throw new HttpException('Password is not correct', HttpStatus.FORBIDDEN); 
        }
        const updUser = { ...user, password: bcrypt.hashSync(dto.newPassword, 10)};
        return this.userRepo.save(updUser);
    }

    async refreshUserPassword(id: string, dto: {password: string}) {
        const user = await this.userRepo.findOne({where: {id}});

        if(!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND); 
        }
        const updUser = { ...user, password: bcrypt.hashSync(dto.password, 10)};
        return this.userRepo.save(updUser);
    }

    async deleteUser(id: string): Promise<void> {
        const user = await this.userRepo.findOne({where: {id}});
        if(!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND); 
        }
        await this.userRepo.delete(id);
    }

    async updateUserInfo(id:string, {...res}: UpdateUserDto) {
        const user = await this.userRepo.findOne({where:{id}});
        if(!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return await this.userRepo.save({...user, ...res});
    }

    async updateUserStatus(id:string, body: UpdateUserStatusDto) {
        const user = await this.userRepo.findOne({where:{id}});
        if(!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return await this.userRepo.save({...user, status: body.status});
    }
}