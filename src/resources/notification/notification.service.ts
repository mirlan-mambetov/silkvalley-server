import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProductService } from '../product/product.service'
import { UploadService } from '../upload/upload.service'
import { UserService } from '../user/user.service'
import { CreateNotifyDto } from './dto/create.notify.dto'

@Injectable()
export class NotificationService {
  constructor(
    private readonly userService: UserService,
    private readonly uploadService: UploadService,
    private readonly productService: ProductService,
    private readonly prismaService: PrismaService,
  ) {}

  async create(dto: CreateNotifyDto) {
    const user = await this.userService.findOneById(dto.userId)
    const notification = await this.prismaService.notification.create({
      data: {
        text: dto.text,
        userId: user.id,
        typeOfNotify: dto.typeOfNotification,
      },
    })
    return notification
  }

  async changeExpire(id: number) {
    try {
      await this.prismaService.notification.update({
        where: {
          id,
        },
        data: {
          expire: true,
        },
      })
      return true
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }
}
