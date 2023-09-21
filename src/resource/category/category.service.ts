import { BadRequestException, Injectable } from '@nestjs/common'
import slugify from 'slugify'
import { PrismaService } from 'src/prisma.service'
import { CategoryDTO, ProductCategoryDTO } from './dto/category.dto'

@Injectable()
export class CategoryService {
  constructor(private readonly Prisma: PrismaService) {}

  /**
   *
   * @returns Main Categories
   */
  async findAllCategories() {
    const categories = await this.Prisma.category.findMany({
      include: {
        categories: true,
      },
    })
    if (!categories.length) throw new BadRequestException('Категорий пока нет')
    return categories
  }

  /**
   *
   * @param id
   * @returns Main Category
   */
  async findById(id: number) {
    const category = await this.Prisma.category.findUnique({ where: { id } })
    if (!category)
      throw new BadRequestException('Категория по такому ID не найден')
    return category
  }

  /**
   *
   * @param id
   * @returns Category
   */
  async findProductCategoryById(id: number) {
    const category = await this.Prisma.productCategory.findUnique({
      where: { id },
    })
    if (!category)
      throw new BadRequestException('Категория по такому ID не найден')
    return category
  }

  /**
   *
   * @returns Product Categories (second categories)
   */
  async findAllProductCategories() {
    const categories = await this.Prisma.productCategory.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
    if (!categories.length)
      throw new BadRequestException(`Категории отсуствуют в базе данных`)
    return categories
  }

  /**
   * @param dto
   * @returns Category
   * @description Create main category
   */
  async createMainCategory(dto: CategoryDTO) {
    const category = await this.Prisma.category.findUnique({
      where: { name: dto.name },
    })
    if (category) throw new BadRequestException('Категория уже существует')
    return await this.Prisma.category.create({
      data: {
        ...dto,
      },
    })
  }

  /**
   *
   * @param mainCategoryId
   * @param dto
   * @returns Product Category
   * @description Create product category
   */
  async createProductCategory(dto: ProductCategoryDTO) {
    const mainCategory = await this.findById(dto.categoryId)
    const slugName = slugify(dto.name, {
      lower: true,
      trim: true,
    })
    return await this.Prisma.productCategory.createMany({
      data: {
        ...dto,
        categoryId: mainCategory.id,
        slug: slugName,
      },
    })
  }

  /**
   *
   * @param id
   * @param dto
   * @returns Create product category
   */
  async updateProductCategory(id: number, dto: ProductCategoryDTO) {
    await this.findById(dto.categoryId)
    await this.findProductCategoryById(id)
    return await this.Prisma.productCategory.updateMany({
      where: { id },
      data: {
        ...dto,
        categoryId: dto.categoryId,
      },
    })
  }

  /**
   * @param id
   * @description deleted product category
   */
  async deleteProductCategory(id: number) {
    await this.findProductCategoryById(id)
    return await this.Prisma.productCategory.delete({ where: { id } })
  }
}
