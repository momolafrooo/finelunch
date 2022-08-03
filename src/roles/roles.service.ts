import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from '../schemas/role.schema';
import { createSlug } from '../utils/slug';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
  ) {}

  async findAll() {
    return this.roleModel.find();
  }

  async findById(id: string) {
    return this.roleModel.findById(id);
  }

  async findBySlug(slug: string) {
    return this.roleModel.findOne({ slug });
  }

  async save(name: string) {
    const slug = createSlug(name);

    const role = await this.findBySlug(slug);

    if (role) throw new BadRequestException('The name has already been taken');

    return this.roleModel.create({
      name,
      slug,
    });
  }

  async update(id: string, name: string) {
    const slug = createSlug(name);

    const role = await this.findBySlug(slug);

    if (role && role._id !== id)
      throw new BadRequestException('The name has already been taken');

    return this.roleModel.findByIdAndUpdate(id, {
      name,
      slug: createSlug(name),
    });
  }

  async destroy(id: string) {
    return this.roleModel.findByIdAndDelete(id);
  }
}
