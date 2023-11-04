import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { EnumProductType, Prisma } from '@prisma/client'
import Slugify from 'slugify'
import { EnumProductSort } from 'src/enums/Filter.enum'
import { PrismaService } from 'src/prisma.service'
import { SortType } from 'types/sortTypes'
import { v4 as uuid } from 'uuid'
import { CategoryService } from '../category/category.service'
import { PaginationService } from '../pagination/pagination.service'
import { MESSAGE_PRODUCT_FOUND } from './constants/message.constants'
import { RETURN_PRODUCT_FIELDS } from './constants/return.product.fields'
import { CreateProductDTO } from './dto/create.product.dto'
import { FiltersDto } from './dto/filters.dto'
import { UpdateProductDTO } from './dto/update.product.dto'
import { ProductsBrandService } from './products-brand/products.brand.service'

@Injectable()
export class ProductsService {
  constructor(
    private readonly prismaSevice: PrismaService,
    private readonly categoryService: CategoryService,
    private readonly paginationService: PaginationService,
    private readonly productBrandService: ProductsBrandService,
  ) {}

  /**
   * @returns ALL PRODUCTS
   */
  async getAllProducts(searchTerm?: string) {
    try {
      const filter = this.createFilter({ searchTerm })
      return await this.prismaSevice.products.findMany({
        where: filter,
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
    const product = await this.prismaSevice.products.findUnique({
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
      const product = await this.prismaSevice.products.findUnique({
        where: { slug },
      })
      if (!product)
        throw new NotFoundException(`Продукт по такому SLUG: ${slug} не найден`)

      const updatedProduct = await this.prismaSevice.products.update({
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
      const products = await this.prismaSevice.products.findMany({
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
      const products = await this.prismaSevice.products.findMany({
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
      const products = await this.prismaSevice.products.findMany({
        where: {
          ...filter,
        },
        skip,
        orderBy: this.sortFilter(filters.sort),
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
    const similar = await this.prismaSevice.products.findMany({
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
      const exclusives = await this.prismaSevice.products.findMany({
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

  async getProductsByBrand(brandId: number) {
    try {
      const products = await this.prismaSevice.products.findMany({
        where: {
          brandId,
        },
      })
      return products
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
    const uniqueKey = uuid({ random: { length: 10 } })

    await this.categoryService.findProductCategoryById(dto.categoryId)
    // CHECK ISALREADY PRODUCT IN DATABASE
    const isExist = await this.prismaSevice.products.findUnique({
      where: { title: dto.title },
    })
    if (isExist) throw new BadRequestException(MESSAGE_PRODUCT_FOUND)

    // ELSE CREATE PRODUCT
    const product = await this.prismaSevice.products.createMany({
      data: {
        title: dto.title,
        description: dto.description,
        poster: dto.poster,
        price: dto.price,
        slug: `${slugName}--${uniqueKey}`,
        productType: dto.productType,
        categoryId: dto.categoryId,
        brandId: dto.brandId,
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
      // CHEck exist current product
      await this.getProducById(id)

      // FILTERD DATA
      const filterd = this.checkExistData<UpdateProductDTO>(dto)

      // CHeck exist current brand
      if (dto.brandId) await this.productBrandService.findById(filterd.brandId)

      // GENERATE SLUG FOR PRODUCT
      if (filterd.title) {
        const slugName = Slugify(filterd.title, {
          lower: true,
          trim: true,
        })
        await this.prismaSevice.products.update({
          where: { id },
          data: {
            ...filterd,
            slug: slugName,
          },
        })
      } else {
        await this.prismaSevice.products.update({
          where: { id },
          data: {
            ...filterd,
          },
        })
      }
    } catch (err) {
      // throw new InternalServerErrorException(err)
      console.log(err)
    }
  }

  /**
   *
   * @param id
   * @description Deleted product
   */
  async deleteProduct(id: number) {
    return await this.prismaSevice.products.delete({ where: { id } })
  }

  /**
   *
   * @param dto
   * @returns Filter
   */
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
      case EnumProductSort.LOW_PRICE:
        return [{ price: 'asc' }]
      case EnumProductSort.HIGH_PRICE:
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
