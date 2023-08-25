import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controller/user.controller';
import { UserEntity } from './entities/user.entity';
import { UserService } from './services/user.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
    ],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService]
})
export class UsersModule {}