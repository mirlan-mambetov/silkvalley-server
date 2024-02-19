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

  /**
   *
   * @param specificationId
   * @param dto
   * @returns
   */
  async create(specificationId: number, dto: ICreateAttributeDTO) {
    try {
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
  async update(specificationId: number, dto: IUpdateAttributeDTO[]) {
    try {
      const specification =
        await this.specificationService.findById(specificationId)
      const updateData = specification.attributes.map((attribute, index) => ({
        where: { id: attribute.id },
        data: {
          name: dto[index].name,
          value: dto[index].value,
        },
      }))
      await Promise.all(
        updateData.map(async (data) => {
          await this.prismaService.productattribute.updateMany(data)
        }),
      )
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
      throw new InternalServerErrorException(err)
    }
  }

  async deleteOne(id: number) {
    try {
      // const decodedName = decodeURIComponent(name)
      await this.prismaService.productattribute.delete({
        where: { id },
      })
      return {
        message: 'Атрибут удален',
      }
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
  }
}
