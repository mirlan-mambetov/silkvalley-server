import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { generateSlug } from 'utils/generate-slug'
import { FiltersService } from '../filters/filters.service'
import { CreateCategoryDTO, CreateChildDTO } from './dto/create.category.dto'
import { UpdateCategoryDTO } from './dto/update.category.dto'

@Injectable()
export class CategoryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly filterService: FiltersService,
  ) {}

  /**
   *
   * @param dto
   * @returns Создает категорию по переданному DTO
   */
  async create(dto: CreateCategoryDTO) {
    try {
      const slugName = generateSlug(dto.name)
      const category = await this.prismaService.category.create({
        data: {
          ...dto,
          slug: slugName,
        },
      })

      return category
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async createChild(dto: CreateChildDTO) {
    try {
      const slugName = generateSlug(dto.name)
      const child = await this.prismaService.category.create({
        data: {
          name: dto.name,
          slug: slugName,
          parentId: dto.parentId,
        },
      })
      return child
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  /**
   *
   * @param id
   * @param dto
   * @returns Сообщение об успешном создании категории
   */
  async update(id: number, dto: UpdateCategoryDTO) {
    try {
      let slugName = generateSlug(dto.name)

      const category = await this.prismaService.category.update({
        where: {
          id,
        },
        data: {
          ...dto,
          slug: slugName,
        },
      })
      return category
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  /**
   *
   * @returns ALL PARENTS
   */
  async findParents() {
    return await this.prismaService.category.findMany({
      where: {
        parentId: null,
      },
      ...this.returnManyArguments(),
    })
  }

  /**
   *
   * @returns Возвращает все категоории
   */
  async findAll() {
    return await this.prismaService.category.findMany()
  }

  /**
   *
   * @param id Параметр ID :number
   * @returns Возвращает категорию по ID
   */
  async findOneById(id: number) {
    const category = await this.prismaService.category.findUnique({
      where: { id },
      include: {
        childs: {
          include: {
            childs: {
              include: {
                childs: true,
              },
            },
          },
        },
        products: {
          select: {
            product: true,
          },
        },
      },
    })
    if (!category) throw new BadRequestException('Категория не найдена')
    return category
  }

  /**
   *
   * @param parentId
   * @returns Возвращает категорию по ID родителя
   */
  async findChildsByParent(parentId: number) {
    try {
      return await this.prismaService.category.findMany({
        where: {
          parentId,
        },
        ...this.returnManyArguments(),
      })
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  /**
   *
   * @param slug Параметр Slug :string
   * @returns Возврощает категорию по Slug
   */
  async findOneBySlug(slug: string) {
    return await this.prismaService.category.findUnique({
      where: {
        slug,
      },
      include: {
        childs: {
          include: {
            childs: {
              include: {
                childs: true,
              },
            },
          },
        },
        products: {
          select: {
            product: true,
          },
        },
      },
    })
  }

  /**
   *
   * @param id Параметр Id :number
   * @returns Сообщение об успешном удалении
   */
  async delete(id: number) {
    try {
      const category = await this.findOneById(id)
      if (category.childs?.length || category.products?.length)
        throw new BadRequestException(
          'Удаление невозможно! В категории есть товары и подкатегории!',
        )
      await this.prismaService.category.delete({ where: { id } })
      return {
        message: 'Категория удалена',
      }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  private returnManyArguments(): Prisma.CategoryFindManyArgs {
    return {
      include: {
        childs: {
          include: {
            childs: {
              include: {
                products: true,
              },
            },
            products: true,
          },
        },
        parentCategory: true,
        products: true,
      },
    }
  }
}
