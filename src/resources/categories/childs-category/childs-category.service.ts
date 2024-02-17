import { BadRequestException, Injectable } from '@nestjs/common'
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

  async create(mainCategoryId: number, dto: CreateChildCategoryDTO) {
    const UNIQUE_ID = generateProductId(3)
    const slugName = dto.name
      ? slugify(dto.name, { lower: true, locale: 'eng' })
      : null
    const mainCategory =
      await this.mainCategoryService.findOneById(mainCategoryId)
    await this.prismaService.secondCategory.create({
      data: {
        ...dto,
        mainCategoryId: mainCategory.id,
        slug: `${slugName}-${UNIQUE_ID}`,
      },
    })
    return {
      message: `Подкатегория к ${mainCategory.name} добавлена`,
    }
  }
  async update(id: number, dto: UpdateChildCategoryDTO) {
    const category = await this.findById(id)
    const UNIQUE_ID = generateProductId(3)
    const slugName = dto.name
      ? slugify(dto.name, { lower: true, locale: 'eng' })
      : null

    await this.prismaService.secondCategory.update({
      where: { id: category.id },
      data: {
        ...dto,
        slug: `${slugName}-${UNIQUE_ID}`,
      },
    })
    return {
      message: `Подкатегория обновлена`,
    }
  }

  async findById(id: number) {
    const category = await this.prismaService.secondCategory.findUnique({
      where: { id },
      include: {
        products: true,
      },
    })
    if (!category)
      throw new BadRequestException('Категория не найдена по такому ID')
    return category
  }

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
