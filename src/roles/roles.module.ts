import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from '../schemas/role.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  providers: [
    {
      provide: 'ROLE_SERVICE',
      useClass: RolesService,
    },
  ],
  exports: [
    {
      provide: 'ROLE_SERVICE',
      useClass: RolesService,
    },
  ],
  controllers: [RolesController],
})
export class RolesModule {}
