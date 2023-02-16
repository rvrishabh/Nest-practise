import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    let existing = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    existing = await this.userRepository.findOne({
      where: {
        mobile: createUserDto.mobile,
      },
    });
    if (existing) {
      throw new BadRequestException('Mobile already exists');
    }

    const user = new User();
    user.name = createUserDto.name;
    user.mobile = createUserDto.mobile;
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    return await this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.name = updateUserDto.name;
    user.mobile = updateUserDto.mobile;
    user.email = updateUserDto.email;
    user.password = updateUserDto.password;
    return await this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return await this.userRepository.remove(user);
  }
}
