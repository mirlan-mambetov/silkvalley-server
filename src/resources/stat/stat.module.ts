import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma.service'
import { StatController } from './stat.controller'
import { StatService } from './stat.service'

@Module({
  imports: [],
  controllers: [StatController],
  providers: [StatService, PrismaService, JwtService],
})
export class StatModule {}
