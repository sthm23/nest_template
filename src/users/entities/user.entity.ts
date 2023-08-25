import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { UserStatus } from '../interfaces/user.interface';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  role: string;

  @Column()
  region: string;

  @Column()
  login: string;

  @Column()
  password: string;

  @Column()
  phoneNumber: string;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column({
    default: Date.now().toString(),
  })
  createDate: string;

  @Column({
    default: UserStatus.Active
  })
  status: string;

}