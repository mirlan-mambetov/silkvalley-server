import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProductService } from '../product.service'
import { SpecificationDTO, SpecificationUpdateDTO } from './data-transfer'

@Injectable()
export class ProductSpecificationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productService: ProductService,
  ) {}

  async create(productId: number, dto: SpecificationDTO[]) {
    const product = await this.productService.findOneById(productId)
    for await (const data of dto) {
      await this.prismaService.specification.createMany({
        data: {
          ...data,
          productId: product.id,
        },
      })
    }
    return {
      message: 'Спецификация добавлена',
    }
  }

  async update(dto: SpecificationUpdateDTO[]) {
    try {
      await this.prismaService.$transaction(async (prisma) => {
        for await (const specification of dto) {
          await prisma.specification.updateMany({
            where: {
              id: specification.id,
            },
            data: {
              name: specification.name,
              value: specification.value,
            },
          })
        }
      })

      return {
        message: 'Спецификация обновлена',
      }
    } catch (error) {
      console.log(error)
      throw new BadRequestException(
        `Произошла неизвестная ошибка доп.смотрите в ${error}`,
      )
    }
  }

  /**
   *
   * @param id
   * @returns
   */
  async delete(id: number) {
    const specification = await this.findById(id)
    await this.prismaService.specification.delete({
      where: { id: specification.id },
    })
    return {
      message: 'Спецификация удалена',
    }
  }

  async findAll() {
    return await this.prismaService.specification.findMany()
  }

  async findById(id: number) {
    const specification = await this.prismaService.specification.findUnique({
      where: { id },
    })
    if (!specification) throw new BadRequestException('Спецификация не найдена')
    return specification
  }
}
