import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { hashPassword } from '../utils/hash';
import { UserDto } from './dto/user.dto';
import { USER_PASSWORD } from '../utils/constants';
import { RolesService } from '../roles/roles.service';
import { PaginationQueryDto } from '../dto/index.dto';
import { getSearchQuery } from '../utils/search';

const SEARCH_FIELDS = ['username', 'email', 'firstName', 'lastName'];

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: PaginateModel<UserDocument>,
    @Inject('ROLE_SERVICE') private readonly roleService: RolesService,
  ) {}

  async findByUsername(username: string) {
    return this.userModel.findOne({ username });
  }

  async findById(id: string) {
    return this.userModel.findById(id);
  }

  async findByIdOrFail(id: string) {
    return this.userModel
      .findById(id)
      .orFail(new NotFoundException('User not found'));
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async findAll(query: PaginationQueryDto) {
    const { page = 1, limit = 12, sort = 'asc', search } = query;

    const options = getSearchQuery(SEARCH_FIELDS, search);

    return this.userModel.paginate(
      {
        $or: options,
      },
      {
        sort: { created_at: sort === 'asc' ? 1 : -1 },
        populate: ['role'],
        limit,
        page,
      },
    );
  }

  async save(userDto: UserDto) {
    if (await this.isEmailUsed(userDto.email))
      throw new BadRequestException('Email already exists');

    if (await this.isUsernameUsed(userDto.username))
      throw new BadRequestException('Username already exists');

    if (userDto.password && userDto.password !== userDto.passwordConfirmation)
      throw new BadRequestException('Password does not match!');

    let role;
    if (userDto.roleSlug) {
      role = await this.roleService.findBySlug(userDto.roleSlug);
    } else {
      role = await this.roleService.findById(userDto.roleId);
    }

    if (!role) throw new BadRequestException('Role not found!');

    return await this.userModel.create({
      ...userDto,
      role,
      password: hashPassword(userDto?.password || USER_PASSWORD),
    });
  }

  async update(id: string, userDto: UserDto) {
    const user = await this.findById(id);

    if (!user) throw new BadRequestException('User not found');

    if (await this.isEmailUsed(userDto.email, id))
      throw new BadRequestException('Email already exists');

    if (await this.isUsernameUsed(userDto.username, id))
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

  async isEmailUsed(email: string, id?: string) {
    const user = await this.findByEmail(email);
    return id ? user && user._id.toString() !== id : !!user;
  }

  async isUsernameUsed(username: string, id?: string) {
    const user = await this.findByUsername(username);
    return id ? user && user._id.toString() !== id : !!user;
  }
}
