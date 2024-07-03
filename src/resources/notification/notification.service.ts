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

  /**
   *
   * @param dto
   * @returns
   */
  async create(dto: CreateNotifyDto) {
    const user = await this.userService.findOneById(dto.userId)

    const notify = await this.prismaService.notification.create({
      data: {
        message: dto.message.trim(),
        type: dto.type,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    })

    return notify
  }

  /**
   *
   * @param id
   * @returns
   */
  async changeExpire(id: number) {
    try {
      const notify = await this.prismaService.notification.update({
        where: {
          id,
        },
        data: {
          read: true,
        },
        select: {
          read: true,
        },
      })
      return notify
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }
}
