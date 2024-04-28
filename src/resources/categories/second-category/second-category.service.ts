import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { createSlugName } from 'src/helpers/create.slug-name'
import { PrismaService } from 'src/prisma.service'
import { CreateChildCategoryDTO } from '../data-transfer/create-childs.dto'
import { UpdateChildCategoryDTO } from '../data-transfer/update-childs.dto'
import { MainCategoryService } from '../main.category.service'

@Injectable()
export class SecondCategoryService {
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
      const uniqueName = createSlugName(dto.name)
      const category =
        await this.mainCategoryService.findOneById(mainCategoryId)
      await this.prismaService.secondCategory.create({
        data: {
          ...dto,
          categoryId: category.id,
          slug: uniqueName,
        },
      })
      return {
        message: `Подкатегория к ${category.name} добавлена`,
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
      const uniqueName = createSlugName(dto.name)
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
          products: { select: { id: true } },
          childsCategories: {
            include: {
              parentCategory: {
                select: {
                  id: true,
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
      if (!category)
        throw new BadRequestException('Категория не найдена по такому ID')
      return category
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  /**
   *
   * @param alias
   * @returns
   */
  async findByAlias(alias: string) {
    try {
      const category = await this.prismaService.secondCategory.findUnique({
        where: { slug: alias },
        include: {
          products: true,
          childsCategories: {
            include: {
              products: {
                select: {
                  id: true,
                },
              },
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })
      if (!category)
        throw new BadRequestException('Категория не найдена по такому SLUG')
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
          category: {
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
  async findByMainCategoryId(categoryId: number) {
    try {
      return await this.prismaService.secondCategory.findMany({
        where: { categoryId },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          childsCategories: {
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
