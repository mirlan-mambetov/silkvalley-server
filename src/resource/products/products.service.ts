import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import Slugify from 'slugify'
import { PrismaService } from 'src/prisma.service'
import { CategoryService } from '../category/category.service'
import { MESSAGE_PRODUCT_FOUND } from './constants/message.constants'
import { RETURN_PRODUCT_FIELDS } from './constants/return.product.fields'
import { CreateProductDTO } from './dto/create.product.dto'
import { UpdateProductDTO } from './dto/update.product.dto'

@Injectable()
export class ProductsService {
  constructor(
    private readonly Prisma: PrismaService,
    private readonly categoryService: CategoryService,
  ) {}

  /**
   * @returns ALL PRODUCTS
   */
  async getAllProducts() {
    try {
      return await this.Prisma.products.findMany({
        include: { ...RETURN_PRODUCT_FIELDS },
      })
    } catch (err) {
      throw new NotFoundException('Товары в базе данных отсуствуют')
    }
  }

  /**
   * @param id
   * @returns Product
   */
  async getProducById(id: number) {
    const product = await this.Prisma.products.findUnique({
      where: { id },
      include: {
        ...RETURN_PRODUCT_FIELDS,
      },
    })
    if (!product)
      throw new NotFoundException('Продукт по такому идентификатору не найден')
    return product
  }

  /**
   * @param slug
   * @returns Product
   */
  async getProductBySlug(slug: string) {
    try {
      const product = await this.Prisma.products.findUnique({
        where: { slug },
        include: RETURN_PRODUCT_FIELDS,
      })
      if (!product)
        throw new NotFoundException(`Продукт по такому SLUG: ${slug} не найден`)
      return product
    } catch (err) {
      throw new BadRequestException(err)
    }
  }

  /**
   * @param dto CreateProductDTO
   * @returns Product
   * @description Create product
   */
  async createProduct(dto: CreateProductDTO) {
    // GENERATE SLUG FOR PRODUCT
    const slugName = Slugify(dto.title, {
      lower: true,
      trim: true,
    })

    if (dto.categoryId)
      await this.categoryService.findProductCategoryById(dto.categoryId)
    // CHECK ISALREADY PRODUCT IN DATABASE
    const isExist = await this.Prisma.products.findUnique({
      where: { title: dto.title },
    })

    // // IF EXIST ON DATA BASE
    if (isExist) throw new BadRequestException(MESSAGE_PRODUCT_FOUND)

    // ELSE CREATE PRODUCT
    const product = await this.Prisma.products.createMany({
      data: {
        title: dto.title,
        description: dto.description,
        poster: dto.poster,
        price: dto.price,
        slug: slugName,
        brand: dto.brand,
        categoryId: dto.categoryId,
      },
    })
    return product
  }

  /**
   * @param id
   * @param dto
   * @param imgId
   * @returns Created Product
   */
  async updateProduct(id: number, dto: UpdateProductDTO) {
    try {
      await this.getProducById(id)

      if (dto.additional) {
        await this.Prisma.products.update({
          where: { id },
          data: {
            additianal_information: {
              deleteMany: {},
              createMany: {
                data: dto.additional.map((element) => ({
                  name: element.name,
                  value: element.value,
                })),
              },
            },
          },
        })
      } else {
        await this.Prisma.products.update({
          where: { id },
          data: {
            ...dto,
          },
        })
      }
    } catch (err) {
      console.log(err)
      throw new InternalServerErrorException(err)
    }
  }

  /**
   *
   * @param id
   * @description Deleted product
   */
  async deleteProduct(id: number) {
    return await this.Prisma.products.delete({ where: { id } })
  }
}
