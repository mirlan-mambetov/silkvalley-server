import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProductsService } from '../products.service'
import { ProductsAdditionalDTO } from './dto/products.addtional.dto'

@Injectable()
export class AdditionalInformationService {
  constructor(
    private readonly Prisma: PrismaService,
    private readonly productsService: ProductsService,
  ) {}

  /**
   *
   * @param dto
   * @description Create new Addtional Product Information
   */
  async create(productId: number, dto: ProductsAdditionalDTO) {
    try {
      return await this.Prisma.productAdditianalInformation.create({
        data: {
          name: dto.name,
          value: dto.value,
          productId,
        },
      })
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
  }

  async update(id: number, dto: ProductsAdditionalDTO) {
    try {
      const isExist = await this.Prisma.productAdditianalInformation.findUnique(
        { where: { id } },
      )
      if (!isExist)
        throw new BadRequestException('Данная информация не существует')
      return await this.Prisma.productAdditianalInformation.update({
        where: { id },
        data: {
          name: dto.name,
          value: dto.value,
        },
      })
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
  }
}
