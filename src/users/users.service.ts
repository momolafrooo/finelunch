import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { hashPassword } from '../utils/hash';
import { UserDto } from './dto/user.dto';
import { USER_PASSWORD } from '../utils/constants';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @Inject('ROLE_SERVICE') private readonly roleService: RolesService,
  ) {}

  async findByUsername(username: string) {
    return this.userModel.findOne({ username });
  }

  async findById(id: string) {
    return this.userModel.findById(id);
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async findAll() {
    return this.userModel.find().sort({ created_at: -1 }).populate('role');
  }

  async save(userDto: UserDto) {
    let user = await this.findByEmail(userDto.email);

    if (user) throw new BadRequestException('Email already exists!');

    user = await this.findByUsername(userDto.username);

    if (user) throw new BadRequestException('Username already exists!');

    const role = await this.roleService.findById(userDto.roleId);

    if (!role) throw new BadRequestException('Role not found!');

    await this.userModel.create({
      ...userDto,
      role,
      password: hashPassword(USER_PASSWORD),
    });

    return userDto;
  }

  async update(id: string, userDto: UserDto) {
    const user = await this.findById(id);

    if (!user) throw new BadRequestException('User not found');

    if (await this.isEmailUnique(userDto.email, id))
      throw new BadRequestException('Email already exists');

    if (await this.isUsernameUnique(userDto.username, id))
      throw new BadRequestException('Username already exists');

    const role = await this.roleService.findById(userDto.roleId);

    if (!role) throw new BadRequestException('Role not found');

    await this.userModel.findByIdAndUpdate(id, { ...userDto, role });

    return userDto;
  }

  async destroy(id: string) {
    const user = await this.findById(id);

    if (!user) throw new BadRequestException('User not found');

    await this.userModel.findByIdAndDelete(id);
  }

  async updatePassword(id: string, password: string) {
    return this.userModel.findByIdAndUpdate(id, {
      password: hashPassword(password),
    });
  }

  async isEmailUnique(email: string, id?: string) {
    const user = await this.findByEmail(email);
    return !user || (user && user._id === id);
  }

  async isUsernameUnique(username: string, id?: string) {
    const user = await this.findByUsername(username);
    return !user || (user && user._id === id);
  }
}
