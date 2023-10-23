import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { EnumProductType, Prisma } from '@prisma/client'
import Slugify from 'slugify'
import { EnumProductPrice, EnumProductSort } from 'src/enums/Filter.enum'
import { PrismaService } from 'src/prisma.service'
import { SortType } from 'types/sortTypes'
import { CategoryService } from '../category/category.service'
import { PaginationService } from '../pagination/pagination.service'
import { MESSAGE_PRODUCT_FOUND } from './constants/message.constants'
import { RETURN_PRODUCT_FIELDS } from './constants/return.product.fields'
import { CreateProductDTO } from './dto/create.product.dto'
import { FiltersDto } from './dto/filters.dto'
import { UpdateProductDTO } from './dto/update.product.dto'

@Injectable()
export class ProductsService {
  constructor(
    private readonly Prisma: PrismaService,
    private readonly categoryService: CategoryService,
    private readonly paginationService: PaginationService,
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

  async getProductsByType(type: EnumProductType) {
    try {
      const products = await this.Prisma.products.findMany({
        where: {
          productType: {
            equals: type,
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

  async getProductsByCategory(filters?: FiltersDto) {
    try {
      const filter = this.createFilter(filters)
      const { perPage, skip } = this.paginationService.getPagination(filters)
      const products = await this.Prisma.products.findMany({
        where: {
          ...filter,
        },
        skip,
        orderBy: this.sortFilter(filters.sort || filters.priceSort),
        take: perPage,
        include: RETURN_PRODUCT_FIELDS,
      })
      return products
    } catch (err) {
      throw new BadRequestException('Продуктов по такой категории нет')
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

  private createFilter(dto: FiltersDto): Prisma.ProductsWhereInput {
    const filters: Prisma.ProductsWhereInput[] = []
    if (dto.searchTerm) filters.push(this.searchFilter(dto.searchTerm))
    if (dto.rating) filters.push(this.ratingFilter(Number(dto.rating)))
    if (dto.categoryId)
      filters.push(this.categoryFilter({ categoryId: +dto.categoryId }))
    if (dto.mainCategoryId)
      filters.push(this.categoryFilter({ mainCategoryId: +dto.mainCategoryId }))
    if (dto.minPrice || dto.maxPrice) {
      filters.push(this.priceFilter(Number(dto.minPrice), Number(dto.maxPrice)))
    }
    return { AND: filters }
  }

  private sortFilter(
    sort: SortType,
  ): Prisma.ProductsOrderByWithRelationInput[] {
    switch (sort) {
      case EnumProductPrice.LOW_PRICE:
        return [{ price: 'asc' }]
      case EnumProductPrice.HIGH_PRICE:
        return [{ price: 'desc' }]
      case EnumProductSort.NEWEST:
        return [{ createdAt: 'desc' }]
      case EnumProductSort.OLDEST:
        return [{ createdAt: 'asc' }]
      case EnumProductSort.POPULAR:
        return [{ views: { sort: 'asc' } }]
      case EnumProductSort.VIEWS:
        return [{ views: { sort: 'desc' } }]
    }
  }

  private categoryFilter({
    categoryId,
    mainCategoryId,
  }: {
    categoryId?: number
    mainCategoryId?: number
  }): Prisma.ProductsWhereInput {
    if (mainCategoryId) {
      return {
        category: {
          categoryId: mainCategoryId,
        },
      }
    }
    if (categoryId) {
      return {
        categoryId,
      }
    }
  }

  private priceFilter(
    minPrice?: number,
    maxPrice?: number,
  ): Prisma.ProductsWhereInput {
    let filter: Prisma.IntFilter | undefined = undefined
    if (minPrice) {
      filter = {
        ...filter,
        gte: minPrice,
      }
    }
    if (maxPrice) {
      filter = {
        ...filter,
        lte: maxPrice,
      }
    }
    return {
      price: filter,
    }
  }

  private ratingFilter(rating: number): Prisma.ProductsWhereInput {
    return {
      rating: {
        equals: rating,
      },
    }
  }

  private searchFilter(searchTerm: string): Prisma.ProductsWhereInput {
    return {
      OR: [
        {
          category: {
            name: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
        {
          title: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
      ],
    }
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
