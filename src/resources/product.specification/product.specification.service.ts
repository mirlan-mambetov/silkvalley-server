import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProductService } from '../product/product.service'

@Injectable()
export class ProductSpecificationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productService: ProductService,
  ) {}

  /**
   *
   * @param productId
   * @returns
   */
  async create(productId: number) {
    try {
      const product = await this.productService.findOneById(productId)
      if (product.specifications)
        throw new BadRequestException('Спецификация уже добавлена')
      const specification =
        await this.prismaService.productSpecification.create({
          data: {
            productId,
          },
        })
      return {
        message: 'Спецификация успешно добавлена',
        specificationId: specification.id,
      }
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
  }

  /**
   *
   * @param id
   * @returns
   */
  async findById(id: number) {
    const specification =
      await this.prismaService.productSpecification.findUnique({
        where: { id },
        include: {
          attributes: true,
        },
      })
    if (!specification)
      throw new BadRequestException('По такому ID спецификация не найдена')
    return specification
  }
}
