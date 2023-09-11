import { Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { ProductsModule } from './products/products.module';

@Module({
  imports: [ProductsModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
