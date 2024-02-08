import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProductSpecificationService } from '../product.specification/product.specification.service'
import { ICreateAttributeDTO } from './data-transfer/create.data.transfer'
import { IUpdateAttributeDTO } from './data-transfer/update.data.transfer'

@Injectable()
export class ProductAttributeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly specificationService: ProductSpecificationService,
  ) {}

  async create(specificationId: number, dto: ICreateAttributeDTO) {
    // try {
    const specifications =
      await this.specificationService.findById(specificationId)
    await this.prismaService.productattribute.create({
      data: {
        ...dto,
        specificationId: specifications.id,
      },
    })
    return {
      message: 'Аттрибут добавлен',
    }
    // } catch (err) {
    //   throw new InternalServerErrorException(err)
    // }
  }

  async update(id: number, dto: IUpdateAttributeDTO) {
    try {
      await this.findById(id)
      await this.prismaService.productattribute.update({
        where: { id },
        data: {
          ...dto,
        },
      })
      return {
        message: 'Аттрибут добавлен',
      }
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
  }

  async findById(id: number) {
    try {
      const attribute = await this.prismaService.productattribute.findUnique({
        where: {
          id,
        },
        select: {
          specification: true,
        },
      })
      if (!attribute) throw new BadRequestException('Атрибут не найден')
      return attribute
    } catch (err) {
      throw new InternalServerErrorException(new BadRequestException(err))
    }
  }
}
