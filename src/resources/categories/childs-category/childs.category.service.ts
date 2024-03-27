import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateChildCategoryDTO } from '../data-transfer/create-childs.dto'
import { UpdateChildCategoryDTO } from '../data-transfer/update-childs.dto'
import { SecondCategoryService } from '../second-category/second-category.service'

@Injectable()
export class ChildsCategoryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly secondCategoryService: SecondCategoryService,
  ) {}

  async create(parentId: number, dto: CreateChildCategoryDTO) {
    const parentCategory = await this.secondCategoryService.findById(parentId)
    // Проверка на существования категории
    const isExistInCategory = parentCategory.childsCategories.some(
      (item) => item.name === dto.name,
    )
    // Если категория уже существует бросаем исключения
    if (isExistInCategory)
      throw new BadRequestException(`${dto.name} категория уже существует`)
    // Иначе создаем
    const uniqueName = this.secondCategoryService.generateUniqueName(dto.name)
    await this.prismaService.childsCategories.create({
      data: {
        ...dto,
        slug: uniqueName,
        parentCategoryId: parentCategory.id,
      },
    })
    return {
      message: 'Категория создана',
    }
  }

  async update(id: number, dto: UpdateChildCategoryDTO) {
    await this.findById(id)

    const uniqueName = this.secondCategoryService.generateUniqueName(dto.name)
    await this.prismaService.childsCategories.update({
      where: { id },
      data: {
        ...dto,
        slug: uniqueName,
      },
    })

    return {
      message: 'Категория обновлена',
    }
  }

  async delete(id: number) {
    await this.prismaService.childsCategories.delete({
      where: { id },
    })
    return {
      messsage: 'Категория удалена',
    }
  }

  async findById(id: number) {
    const category = await this.prismaService.childsCategories.findUnique({
      where: { id },
    })
    if (!category)
      throw new BadRequestException(
        'Категория по данному ID не найден. Либо не существует',
      )
    return category
  }

  async findByParentAlias(parentAlias: string) {
    const categories = await this.prismaService.childsCategories.findMany({
      where: {
        slug: parentAlias,
      },
      include: {
        parentCategory: {
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
    return categories
  }

  async findAll() {
    const categories = await this.prismaService.childsCategories.findMany({
      include: {
        parentCategory: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
    return categories
  }

  async findByAlias() {}
}