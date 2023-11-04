import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import slugify from 'slugify'
import { PrismaService } from 'src/prisma.service'
import { ProductBrandDTO } from './dto/product.brand.dto'

@Injectable()
export class ProductsBrandService {
  constructor(private readonly prismaSevice: PrismaService) {}

  /**
   * @param dto
   * @returns Created new Brand
   */
  async create(dto: ProductBrandDTO) {
    try {
      const isExistBrand = await this.prismaSevice.productBrand.findUnique({
        where: { name: dto.name },
      })
      if (isExistBrand)
        throw new BadRequestException('Бренд с таким названием уже существует')

      const slugName = slugify(dto.name, { lower: true, trim: true })

      const newBrand = await this.prismaSevice.productBrand.create({
        data: {
          name: dto.name,
          slug: slugName,
        },
      })
      return newBrand
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
  }

  /**
   * @param name
   * @returns Brand
   */
  async findByName(name: string) {
    try {
      const brand = await this.prismaSevice.productBrand.findUnique({
        where: { name },
      })
      if (!brand)
        throw new BadRequestException('Бренд по такому названию не найден')
      return brand
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
  }

  /**
   * @param name
   * @returns Brand By ID
   */
  async findById(id: number) {
    try {
      const brand = await this.prismaSevice.productBrand.findUnique({
        where: { id: +id },
        select: {
          id: true,
          name: true,
        },
      })
      if (!brand) throw new BadRequestException('Бренд по такому ID не найден')
      return brand
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
  }

  /**
   * @returns All Brands[]
   */
  async findAllBrands() {
    try {
      return await this.prismaSevice.productBrand.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          products: {
            select: {
              id: true,
            },
          },
        },
      })
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
  }
}
