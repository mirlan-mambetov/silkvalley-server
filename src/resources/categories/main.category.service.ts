import { BadRequestException, Injectable } from '@nestjs/common'
import slugify from 'slugify'
import { generateProductId } from 'src/helpers/generate.id'
import { PrismaService } from 'src/prisma.service'
import { ProductService } from '../product/product.service'
import { CreateMainCategoryDTO } from './data-transfer/create.main-category.dto'
import { UpdateMainCategoryDTO } from './data-transfer/update.main-category.dto'
import { returnCategoryFields } from './objects/returnCategoryFields'

@Injectable()
export class MainCategoryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productService: ProductService,
  ) {}

  async create(dto: CreateMainCategoryDTO) {
    const isExist = await this.prismaService.mainCategory.findUnique({
      where: { name: dto.name },
    })
    if (isExist)
      throw new BadRequestException(
        'Невозможно создать, категория уже существует',
      )
    const UNIQUE_ID = generateProductId(3)
    const slugName = dto.name
      ? slugify(dto.name, { lower: true, locale: 'eng' })
      : null
    await this.prismaService.mainCategory.create({
      data: {
        name: dto.name.trim(),
        slug: `${slugName}-${UNIQUE_ID}`,
      },
    })
    return {
      message: 'Категория создана!',
    }
  }

  async update(id: number, dto: UpdateMainCategoryDTO) {
    await this.findOneById(id)
    const UNIQUE_ID = generateProductId(3)
    const slugName = dto.name
      ? slugify(dto.name, { lower: true, locale: 'eng' })
      : null
    await this.prismaService.mainCategory.update({
      where: { id },
      data: {
        name: dto.name.trim(),
        slug: `${slugName}-${UNIQUE_ID}`,
      },
    })
    return {
      message: 'Категория оновлена!',
    }
  }

  async findAll() {
    return await this.prismaService.mainCategory.findMany({
      ...returnCategoryFields,
    })
  }

  async findOneById(id: number) {
    const category = await this.prismaService.mainCategory.findUnique({
      where: { id },
      include: {
        products: true,
        childCategories: true,
      },
    })
    if (!category)
      throw new BadRequestException('Категория по такому ID не найдена')
    return category
  }

  async findOneByName(name: string) {
    const category = await this.prismaService.mainCategory.findUnique({
      where: { name },
    })
    if (!category)
      throw new BadRequestException('Категория по такому названию не найдена')
    return category
  }

  async findOneBySlug(slug: string) {
    const category = await this.prismaService.mainCategory.findUnique({
      where: { slug: slug },
      include: {
        childCategories: {
          include: {
            products: true,
          },
        },
        products: {
          select: {
            id: true,
          },
        },
      },
    })
    if (!category)
      throw new BadRequestException('Категория по такому SLUG не найдена')
    return category
  }

  async delete(id: number) {
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
  }
}
