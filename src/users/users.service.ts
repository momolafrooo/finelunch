import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { hashPassword } from '../utils/hash';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async findByUsername(username: string) {
    return this.userModel.findOne({ username });
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async updatePassword(id: string, password: string) {
    return this.userModel.findByIdAndUpdate(id, {
      password: hashPassword(password),
    });
  }
}
