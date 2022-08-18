import { BadRequestException, Injectable } from '@nestjs/common';
import { PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from '../schemas/role.schema';
import { createSlug } from '../utils/slug';
import { PaginationQueryDto } from '../dto/index.dto';
import { getSearchQuery } from '../utils/search';

const SEARCH_FIELDS = ['name'];

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: PaginateModel<RoleDocument>,
  ) {}

  async findAll(query: PaginationQueryDto) {
    const { page = 1, limit = 12, sort = 'asc', search } = query;

    const options = getSearchQuery(SEARCH_FIELDS, search);
    return this.roleModel.paginate(
      {
        $or: options,
      },
      {
        sort: { created_at: sort === 'asc' ? 1 : -1 },
        limit,
        page,
      },
    );
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
