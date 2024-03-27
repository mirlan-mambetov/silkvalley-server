import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import slugify from 'slugify'
import { generateProductId } from 'src/helpers/generate.id'
import { PrismaService } from 'src/prisma.service'
import { CreateChildCategoryDTO } from '../data-transfer/create-childs.dto'
import { UpdateChildCategoryDTO } from '../data-transfer/update-childs.dto'
import { MainCategoryService } from '../main.category.service'

@Injectable()
export class ChildsCategoryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mainCategoryService: MainCategoryService,
  ) {}

  /**
   *
   * @param mainCategoryId
   * @param dto
   * @returns
   */
  async create(mainCategoryId: number, dto: CreateChildCategoryDTO) {
    try {
      const uniqueName = this.generateUniqueName(dto.name)
      const mainCategory =
        await this.mainCategoryService.findOneById(mainCategoryId)
      await this.prismaService.secondCategory.create({
        data: {
          ...dto,
          mainCategoryId: mainCategory.id,
          slug: uniqueName,
        },
      })
      return {
        message: `Подкатегория к ${mainCategory.name} добавлена`,
      }
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  /**
   *
   * @param id
   * @param dto
   * @returns
   */
  async update(id: number, dto: UpdateChildCategoryDTO) {
    try {
      const category = await this.findById(id)
      const uniqueName = this.generateUniqueName(dto.name)
      await this.prismaService.secondCategory.update({
        where: { id: category.id },
        data: {
          ...dto,
          slug: uniqueName,
        },
      })
      return {
        message: `Подкатегория обновлена`,
      }
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  /**
   *
   * @param id
   * @returns
   */
  async findById(id: number) {
    try {
      const category = await this.prismaService.secondCategory.findUnique({
        where: { id },
        include: {
          products: true,
        },
      })
      if (!category)
        throw new BadRequestException('Категория не найдена по такому ID')
      return category
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  /**
   *
   * @returns
   */
  async findAll() {
    try {
      return await this.prismaService.secondCategory.findMany({
        include: {
          mainCategory: {
            select: {
              id: true,
              name: true,
            },
          },
          products: {
            select: {
              id: true,
            },
          },
        },
      })
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  /**
   *
   * @param mainCategoryId
   * @returns
   */
  async findByMainCategoryId(mainCategoryId: number) {
    try {
      return await this.prismaService.secondCategory.findMany({
        where: { mainCategoryId },
        include: {
          mainCategory: {
            select: {
              id: true,
              name: true,
            },
          },
          products: {
            select: {
              id: true,
            },
          },
        },
      })
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  /**
   *
   * @param name
   * @returns
   */
  private generateUniqueName(name: string) {
    const UNIQUE_ID = generateProductId(3)
    const slugName = name ? slugify(name, { lower: true, locale: 'eng' }) : null

    return `${slugName}-${UNIQUE_ID}`
  }

  /**
   *
   * @param id
   * @returns
   */
  async delete(id: number) {
    const category = await this.findById(id)
    if (category.products.length) {
      throw new BadRequestException(
        'Удаление невозможно! В категории есть товары!',
      )
    }
    await this.prismaService.secondCategory.delete({ where: { id } })
    return {
      message: 'Категория удалена',
    }
  }
}
