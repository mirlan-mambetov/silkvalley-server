import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProductsModule } from '../products.module'
import { AdditionalInformationController } from './products.additional.controller'
import { AdditionalInformationService } from './products.additional.service'

@Module({
  imports: [ProductsModule],
  controllers: [AdditionalInformationController],
  providers: [AdditionalInformationService, PrismaService],
})
export class AdditionalInformationModule {}
