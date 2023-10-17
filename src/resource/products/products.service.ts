import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { EnumProductType } from '@prisma/client'
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
        orderBy: {
          updatedAt: 'desc',
        },
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
      })
      if (!product)
        throw new NotFoundException(`Продукт по такому SLUG: ${slug} не найден`)

      const updatedProduct = await this.Prisma.products.update({
        where: {
          id: product.id,
        },
        data: {
          views: {
            increment: 1,
          },
        },
        include: RETURN_PRODUCT_FIELDS,
      })
      return updatedProduct
    } catch (err) {
      throw new BadRequestException(err)
    }
  }

  async getPopularProducts() {
    try {
      const products = await this.Prisma.products.findMany({
        where: {
          views: {
            gt: 10,
          },
        },
        include: RETURN_PRODUCT_FIELDS,
        orderBy: {
          updatedAt: 'desc',
        },
      })
      return products
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
  }

  async getForWomans() {
    try {
      const products = await this.Prisma.products.findMany({
        where: {
          productType: {
            equals: EnumProductType.WOMAN,
          },
        },
        include: RETURN_PRODUCT_FIELDS,
      })
      if (!products) throw new BadRequestException('Категория для женщин пуста')
      return products
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
  }

  /**
   * @param productId
   * @returns Similar Products
   */
  async getSimilar(productId: number) {
    const product = await this.getProducById(productId)
    const similar = await this.Prisma.products.findMany({
      where: {
        category: {
          name: product.category.name,
        },
        NOT: {
          id: product.id,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: RETURN_PRODUCT_FIELDS,
    })
    return similar
  }

  /**
   * @description GET Exclusive Products
   * @returns Exclusive Products[]
   */
  async getExclusiveProducts() {
    try {
      const exclusives = await this.Prisma.products.findMany({
        where: {
          exclusive: true,
        },
      })
      if (!exclusives)
        throw new BadRequestException('Нет эксклюзивных продуктов')
      return exclusives
    } catch (err) {
      throw new InternalServerErrorException(err)
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
        productType: dto.productType,
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

      const filterd = this.checkExistData<UpdateProductDTO>(dto)

      // GENERATE SLUG FOR PRODUCT
      const slugName = Slugify(filterd.title, {
        lower: true,
        trim: true,
      })
      await this.Prisma.products.update({
        where: { id },
        data: {
          ...filterd,
          slug: slugName,
        },
      })
    } catch (err) {
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

  private checkExistData<T = {}>(dto: T): T {
    const filterd: T = Object.keys(dto).reduce((filterdData, key) => {
      if (dto[key] !== undefined && dto[key] !== null && dto[key] !== '') {
        filterdData[key] = dto[key]
      }
      return filterdData
    }, dto)
    return filterd
  }
}
