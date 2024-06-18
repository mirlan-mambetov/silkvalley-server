import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProductService } from '../product/product.service'
import { UploadService } from '../upload/upload.service'
import { CreateAttributeDTO } from './data-transfer/create.data.transfer'
import { IUpdateAttributeDTO } from './data-transfer/update.data.transfer'

@Injectable()
export class ProductAttributeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productService: ProductService,
    private readonly uploadService: UploadService,
  ) {}

  /**
   *
   * @param specificationId
   * @param dto
   * @returns
   */
  async create(productId: number, dto: CreateAttributeDTO) {
    try {
      // const product = await this.productService.findOneById(productId)
      // await this.prismaService.productAttributes.create({
      //   data: {
      //     ...dto,
      //     product: {
      //       connect: {
      //         id: product.id,
      //       },
      //     },
      //   },
      // })
      return {
        message: 'Аттрибут добавлен',
      }
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
  }

  /**
   *
   * @param specificationId
   * @param dto
   * @returns String Message
   */
  async update(id: number, dto: IUpdateAttributeDTO) {
    try {
      const attribute = await this.findById(id)
      // await this.prismaService.productAttributes.update({
      //   where: { id: attribute.id },
      //   data: {
      //     ...dto,
      //   },
      // })
      return {
        message: 'Аттрибут обновлен',
      }
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
  }

  /**
   *
   * @param id
   * @returns
   * @description Вывод одного атрибута
   */
  async findById(id: number) {
    // try {
    //   const attribute = await this.prismaService.productAttributes.findUnique({
    //     where: {
    //       id,
    //     },
    //   })
    //   if (!attribute) throw new BadRequestException('Атрибут не найден')
    //   return attribute
    // } catch (err) {
    //   throw new InternalServerErrorException(err)
    // }
  }

  /**
   *
   * @param id
   * @returns
   */
  async deleteOne(id: number) {
    try {
      // const attribute = await this.findById(id)
      // for await (const img of attribute.images) {
      //   await this.uploadService.deleteFile(img)
      // }
      // await this.prismaService.productAttributes.delete({
      //   where: { id },
      // })
      // return {
      //   message: 'Атрибут удален',
      // }
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
  }
}
