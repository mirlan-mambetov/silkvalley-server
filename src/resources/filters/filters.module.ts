import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { FiltersController } from './filters.controller'
import { FiltersService } from './filters.service'

@Module({
  imports: [],
  providers: [FiltersService, PrismaService],
  controllers: [FiltersController],
})
export class FiltersModule {}
