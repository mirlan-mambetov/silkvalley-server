import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import slugify from 'slugify'
import { PrismaService } from 'src/prisma.service'
import { v4 as Uuid } from 'uuid'
import { CategoryDTO, ProductCategoryDTO } from './dto/category.dto'

@Injectable()
export class CategoryService {
  constructor(private readonly Prisma: PrismaService) {}

  /**
   *
   * @returns Main Categories
   */
  async findAllMainCategories() {
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
  async findMainCategoryById(id: number) {
    const category = await this.Prisma.category.findUnique({
      where: { id },
      include: { categories: true },
    })
    if (!category)
      throw new BadRequestException('Категория по такому ID не найден')
    return category
  }

  /**
   *
   * @param id
   * @returns Main Category
   * @description Find Main category by slug
   */
  async findMainCategoryBySlug(slug: string) {
    const category = await this.Prisma.category.findUnique({
      where: { slug },
      include: {
        categories: {
          include: {
            products: true,
          },
        },
      },
    })
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
      include: {
        products: true,
      },
    })
    if (!category)
      throw new BadRequestException('Категория по такому ID не найден')
    return category
  }

  /**
   *
   * @param id
   * @returns Product Category
   */
  async findProductCategoryBySlug(slug: string) {
    const category = await this.Prisma.productCategory.findUnique({
      where: { slug },
      include: {
        products: true,
      },
    })
    if (!category)
      throw new BadRequestException('Категория по такому ID не найден')
    return category
  }

  async findProductCategoryByCategoryId(categoryId: number) {
    const category = await this.Prisma.productCategory.findMany({
      where: { categoryId },
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
    const slugName = slugify(dto.name, {
      lower: true,
      trim: true,
    })
    return await this.Prisma.category.create({
      data: {
        ...dto,
        slug: slugName,
      },
    })
  }

  /**
   *
   * @param id
   * @param dto
   * @description Update main category
   */
  async updateMainCategory(id: number, dto: CategoryDTO) {
    const category = await this.findMainCategoryById(id)
    if (!category)
      throw new BadRequestException(
        'Категория не существует по такому ID. Редактирование невозможно',
      )
    if (dto.name) {
      const slugName = slugify(dto.name, {
        lower: true,
        trim: true,
      })
      await this.Prisma.category.update({
        where: { id },
        data: {
          ...dto,
          slug: slugName,
        },
      })
    } else {
      return await this.Prisma.category.update({
        where: { id },
        data: {
          ...dto,
        },
      })
    }
  }

  /**
   *
   * @param mainCategoryId
   * @param dto
   * @returns Product Category
   * @description Create product category
   */
  async createProductCategory(dto: ProductCategoryDTO) {
    try {
      const uniqueId = Uuid()
      const mainCategory = await this.findMainCategoryById(dto.categoryId)
      const slugName = slugify(dto.name, {
        lower: true,
        trim: true,
      })
      return await this.Prisma.productCategory.createMany({
        data: {
          ...dto,
          categoryId: mainCategory.id,
          slug: `${slugName}-${uniqueId}`,
        },
      })
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
  }

  /**
   *
   * @param id
   * @param dto
   * @returns Create product category
   */
  async updateProductCategory(id: number, dto: ProductCategoryDTO) {
    try {
      if (dto.categoryId) await this.findMainCategoryById(dto.categoryId)
      await this.findProductCategoryById(id)
      const uniqueId = Uuid()
      const slugName = slugify(dto.name, {
        lower: true,
        trim: true,
      })
      return await this.Prisma.productCategory.updateMany({
        where: { id },
        data: {
          ...dto,
          slug: `${slugName}-${uniqueId}`,
        },
      })
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
  }

  /**
   * @param id
   * @description deleted product category
   */
  async deleteMainCategory(id: number) {
    const category = await this.findMainCategoryById(id)
    if (category.categories.length)
      throw new BadRequestException(
        `Удаление невозможно, так как у категории "${category.name}" есть подкатегории!`,
      )
    return await this.Prisma.productCategory.delete({ where: { id } })
  }

  /**
   * @param id
   * @description deleted product category
   */
  async deleteProductCategory(id: number) {
    const category = await this.findProductCategoryById(id)
    if (category && category.products.length)
      throw new BadRequestException(
        `Удаление категории '${category.name}' невозможно. Так как содержит товары!`,
      )
    return await this.Prisma.productCategory.delete({ where: { id } })
  }
}
