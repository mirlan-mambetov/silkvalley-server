import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import slugify from 'slugify'
import { generateProductId } from 'src/helpers/generate.id'
import { PrismaService } from 'src/prisma.service'
import { ProductService } from '../product/product.service'
import { CreateMainCategoryDTO } from './data-transfer/create.main-category.dto'
import { UpdateMainCategoryDTO } from './data-transfer/update.main-category.dto'
import {
  returnCategoryFields,
  returnCategoryUniqueFields,
} from './objects/returnCategoryFields'

@Injectable()
export class MainCategoryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productService: ProductService,
  ) {}

  /**
   *
   * @param dto
   * @returns Создает категорию по переданному DTO
   */
  async create(dto: CreateMainCategoryDTO) {
    try {
      const isExist = await this.prismaService.mainCategory.findUnique({
        where: { name: dto.name },
      })
      if (isExist)
        throw new BadRequestException(
          'Невозможно создать, категория уже существует',
        )
      const uniqueName = this.createUniqueId(dto.name)
        ? slugify(dto.name, { lower: true, locale: 'eng' })
        : null
      await this.prismaService.mainCategory.create({
        data: {
          name: dto.name.trim(),
          slug: uniqueName,
        },
      })
      return {
        message: 'Категория создана!',
      }
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  /**
   *
   * @param id
   * @param dto
   * @returns Сообщение об успешном создании категории
   */
  async update(id: number, dto: UpdateMainCategoryDTO) {
    try {
      await this.findOneById(id)
      const uniqueName = this.createUniqueId(dto.name)
      await this.prismaService.mainCategory.update({
        where: { id },
        data: {
          name: dto.name.trim(),
          slug: uniqueName,
        },
      })
      return {
        message: 'Категория оновлена!',
      }
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  /**
   *
   * @returns Возврощает все категоории плюс связи с Attributes & Products
   */
  async findAll() {
    return await this.prismaService.mainCategory.findMany({
      ...returnCategoryFields,
    })
  }

  /**
   *
   * @param id Параметр ID :number
   * @returns Возврощает категорию по ID
   */
  async findOneById(id: number) {
    return await this.findByUniqueName(id)
  }

  /**
   *
   * @param name Параметр Name :string
   * @returns Возврощает категорию по Name
   */
  async findOneByName(name: string) {
    return await this.findByUniqueName(name)
  }

  /**
   *
   * @param slug Параметр Slug :string
   * @returns Возврощает категорию по Slug
   */
  async findOneBySlug(slug: string) {
    return await this.findByUniqueName({ slug })
  }

  /**
   * @param uniqueName Параметром принимает либо строку, либо Число это может быть ID & Name & Slug
   * @returns Возвращает категорию по ID или Name & Slug
   */
  private async findByUniqueName(
    uniqueName: string | number | { slug: string },
    options?: {},
  ) {
    let category: any | null = null
    let filter: any = {}
    if (typeof uniqueName === 'number') {
      filter = { id: uniqueName }
    } else if (typeof uniqueName === 'string') {
      filter = { name: uniqueName }
    } else if (uniqueName.slug) {
      filter = { slug: uniqueName.slug }
    }
    try {
      category = await this.prismaService.mainCategory.findUnique({
        where: filter,
        ...options,
        ...returnCategoryUniqueFields,
        include: {
          categories: {
            include: {
              childsCategories: {
                select: {
                  id: true,
                  name: true,
                  products: {
                    select: {
                      id: true,
                    },
                  },
                },
              },
              products: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      })
      if (!category) {
        if (typeof uniqueName === 'number') {
          throw new BadRequestException(
            'Главная категория по такому ID не найдена',
          )
        } else if (typeof uniqueName === 'string') {
          throw new BadRequestException(
            'Главная категория по такому Названию не найдена',
          )
        } else if (uniqueName.slug) {
          throw new BadRequestException(
            'Главная категория по такому SLUG не найдена',
          )
        }
      }
      return category
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  /**
   *
   * @param name
   * @returns Возврощает уникальное значение из переданного
   */
  private createUniqueId(name: string) {
    const UNIQUE_ID = generateProductId(3)
    const slugName = name ? slugify(name, { lower: true, locale: 'eng' }) : null

    return `${slugName}-${UNIQUE_ID}`
  }

  /**
   *
   * @param id Параметр Id :number
   * @returns Сообщение об успешном удалении
   */
  async delete(id: number) {
    try {
      const category = await this.findOneById(id)
      if (category.childCategories.length || category.products.length) {
        throw new BadRequestException(
          'Удаление невозможно! В категории есть товары и подкатегории!',
        )
      }
      await this.prismaService.mainCategory.delete({ where: { id } })
      return {
        message: 'Категория удалена',
      }
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }
}
