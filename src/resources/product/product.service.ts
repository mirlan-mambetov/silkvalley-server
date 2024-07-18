import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { Product, ProductVariant } from '@prisma/client'
import { generateProductId } from 'src/helpers/generate.id'
import { PrismaService } from 'src/prisma.service'
import { generateSlug } from 'utils/generate-slug'
import { UploadService } from '../upload/upload.service'
import { CreateProductDto } from './data-transfer/create.data.transfer'
import {
  CreateColorDTO,
  CreateProductVariantDto,
  CreateSpecificationDto,
  UpdateColorDTO,
  UpdateSpecificationDto,
} from './data-transfer/product-variant.dto'
import { UpdateProductVariantDto } from './data-transfer/product-variant.update.dto'
import { UpdateProductDto } from './data-transfer/update.data.transfer'

@Injectable()
export class ProductService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  /**
   *
   * @param dto
   * @param posterPath
   * @returns Созданный продукт (Товар)
   * @description Создание продукта (Товара)
   */
  async create(dto: CreateProductDto) {
    try {
      const { categoryIds, ...productData } = dto
      const slugName = generateSlug(dto.title)
      await this.prismaService.product.create({
        data: {
          ...productData,
          slug: slugName,
          categories: categoryIds
            ? {
                create: categoryIds.map((categoryId) => ({
                  category: { connect: { id: categoryId } },
                })),
              }
            : undefined,
        },
      })
      return {
        message: 'Товар успешно добавлен',
      }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  /**
   *
   * @param id
   * @param dto
   * @returns
   */
  async update(id: number, dto: UpdateProductDto) {
    try {
      const { categoryIds, ...productData } = dto
      // Обновляем данные продукта
      await this.prismaService.product.update({
        where: { id },
        data: {
          ...productData,
        },
      })

      if (categoryIds && categoryIds.length) {
        // Обновляем основные данные продукта
        const currentCategories =
          await this.prismaService.productCategory.findMany({
            where: { productId: id },
          })
        const currentCategoryIds = currentCategories.map(
          (cat) => cat.categoryId,
        )
        const categoriesToAdd = categoryIds.filter(
          (catId) => !currentCategoryIds.includes(catId),
        )
        const categoriesToRemove = currentCategoryIds.filter(
          (catId) => !categoryIds.includes(catId),
        )
        // Начинаем транзакцию
        await this.prismaService.$transaction(async (prisma) => {
          // Удаляем ненужные связи
          if (categoriesToRemove.length > 0) {
            await prisma.productCategory.deleteMany({
              where: {
                productId: id,
                categoryId: { in: categoriesToRemove },
              },
            })
          }

          // Создаем новые связи
          if (categoriesToAdd.length > 0) {
            await prisma.productCategory.createMany({
              data: categoriesToAdd.map((categoryId) => ({
                productId: id,
                categoryId,
              })),
            })
          }
        })
      }
      return {
        message: 'Товар успешно отредактирован',
      }
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  /**
   *
   * @returns ALL PRODUCTS
   */
  async findAllProducts(): Promise<Product[]> {
    return await this.prismaService.product.findMany({
      include: {
        variants: {
          include: {
            color: true,
            specifications: true,
          },
        },
        promotion: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  /**
   * @description CREATE VARIANT TO PRODUCT
   * @param dto
   * @returns [VariantID, SuccessMessage]
   */
  async createProductVariant(dto: CreateProductVariantDto) {
    const productId = dto.productId
    const allVariants = await this.prismaService.productVariant.findMany({
      where: {
        productId,
      },
    })
    if (allVariants.length) {
      await this.prismaService.product.update({
        where: {
          id: productId,
        },
        data: {
          defaultPrice: allVariants[0].price,
        },
      })
    }
    const articleNumber = generateProductId()
    const variant = await this.prismaService.productVariant.create({
      data: {
        ...dto,
        price: Number(dto.price),
        articleNumber,
        productId,
      },
    })
    return {
      variantId: variant.id,
      message: 'Вариант добавлен',
    }
  }

  /**
   *
   * @param dto
   */
  async createColor(dto: CreateColorDTO) {
    await this.prismaService.colors.create({
      data: {
        ...dto,
        variantId: dto.variantId,
      },
    })
    return {
      message: 'Цвета добавлены',
    }
  }

  /**
   *
   * @param dto
   * @returns
   */
  async updateColor(dto: UpdateColorDTO) {
    await this.prismaService.colors.update({
      where: { id: dto.colorId },
      data: {
        color: dto.color,
        images: dto.images,
      },
    })
    return {
      message: 'Цвета обновлены',
    }
  }

  /**
   *
   * @param id
   * @param path
   */
  async removeColorImage(id: number, path: string) {
    try {
      const color = await this.prismaService.colors.findUnique({
        where: { id },
      })
      const existPath = color.images.find((imgPath) => imgPath === path)
      if (existPath) {
        await this.uploadService.deleteFile(existPath)
        const updatedImages = color.images.filter((imgPath) => imgPath !== path)

        await this.prismaService.colors.update({
          where: {
            id,
          },
          data: {
            images: updatedImages,
          },
        })
      }
      return {
        message: 'Изображение удалено',
      }
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  /**
   *
   * @param dto
   * @returns
   */
  async createSpecifications(dto: CreateSpecificationDto) {
    await this.prismaService.specification.createMany({
      data: dto.specifications.map((s) => ({
        name: s.name,
        value: s.value,
        variantsId: s.variantId,
      })),
    })
    return {
      message: 'Спецификации добавлены',
    }
  }

  /**
   *
   * @param dto
   * @returns
   */
  async updateSpecifications(dto: UpdateSpecificationDto) {
    await this.prismaService.$transaction(async (prisma) => {
      for await (const specification of dto.specifications) {
        await prisma.specification.updateMany({
          where: {
            id: specification.id,
          },
          data: {
            name: specification.name,
            value: specification.value,
          },
        })
      }
    })
    return {
      message: 'Спецификации обновлены',
    }
  }

  /**
   *
   * @param variantId
   * @param dto
   * @returns
   */
  async updateProductVariant(variantId: number, dto: UpdateProductVariantDto) {
    await this.prismaService.productVariant.update({
      where: { id: variantId },
      data: {
        ...dto,
      },
    })
    return {
      message: 'Вариант обновлен',
    }
  }

  /**
   *
   * @param productId
   * @returns
   */
  async findVariantById(id: number): Promise<ProductVariant> {
    return this.prismaService.productVariant.findUnique({
      where: { id },
      include: {
        color: true,
        specifications: true,
      },
    })
  }

  /**
   *
   * @param ids
   * @returns
   */
  async findVariantsByIds(ids: number[]): Promise<ProductVariant[]> {
    const variants = await this.prismaService.productVariant.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        color: true,
        specifications: true,
      },
    })
    return variants
  }

  /**
   *
   * @param alias Вывод продукта по [SLUG]
   * @returns Возвращает один продукт, если найден
   */
  async findOneBySlug(slug: string) {
    try {
      const product = await this.prismaService.product.findUnique({
        where: { slug },
        include: {
          categories: {
            select: {
              id: true,
              categoryId: true,
              category: true,
              productId: true,
            },
          },
          promotion: true,
          variants: {
            include: {
              color: true,
              specifications: true,
            },
            orderBy: {
              updatedAt: 'desc',
            },
          },
        },
      })
      if (!product)
        throw new NotFoundException(`Продук по такому "${slug}" не найден`)
      return product
    } catch (error) {
      throw new NotFoundException(error.response)
    }
  }

  /**
   *
   * @param alias Вывод продукта по [id]
   * @returns Возвращает один продукт, если найден
   */
  async findOneById(id: number) {
    try {
      const product = await this.prismaService.product.findUnique({
        where: {
          id,
        },
        include: {
          promotion: true,
          categories: true,
          variants: true,
        },
      })
      if (!product)
        throw new BadRequestException('Продукт по такому ID не найден')
      return product
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  /**
   *
   * @param id
   * @returns
   */
  async findColorById(id: number) {
    return await this.prismaService.colors.findUnique({
      where: {
        id,
      },
      select: {
        color: true,
        id: true,
        images: true,
      },
    })
  }

  /**
   *
   * @param slug
   * @returns
   */
  async findByCategoryId(slug: string) {
    return await this.prismaService.product.findMany({
      where: {
        categories: {
          some: {
            category: {
              slug,
            },
          },
        },
      },
      include: {
        variants: {
          include: {
            color: true,
            specifications: true,
          },
        },
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })
  }

  /**
   *
   * @param id
   * @returns
   */
  async findSpecificationByVariantId(variantId: number) {
    return await this.prismaService.specification.findMany({
      where: {
        variants: {
          id: variantId,
        },
      },
      select: {
        id: true,
        name: true,
        value: true,
      },
    })
  }

  /**
   *
   * @param productId
   * @returns SIMILAR PRODUCTS []
   */
  async findSimilar(productId: number) {
    const product = await this.prismaService.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        categories: {
          include: {
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    if (!product || !product.categories.length) {
      return []
    }

    const products = await this.prismaService.product.findMany({
      where: {
        id: {
          not: product.id,
        },
        categories: {
          some: {
            category: {
              name: product.categories[0].category.name,
            },
          },
        },
      },
      include: {
        variants: {
          include: {
            color: true,
            specifications: true,
          },
        },
      },
    })
    return products
  }

  /**
   *
   * @param id
   * @returns
   */
  async delete(id: number) {
    try {
      const product = await this.findOneById(id)

      await this.prismaService.$transaction(async (prisma) => {
        const variants = await prisma.productVariant.findMany({
          where: {
            productId: product.id,
          },
        })

        const orders = await prisma.order.findMany({
          where: {
            items: {
              some: {
                id: 1,
              },
            },
          },
        })
      })
      // DELETE PRODUCT POSTER
      await this.uploadService.deleteFile(product.poster)

      // DELETE PRODUCT
      await this.prismaService.product.delete({
        where: { id },
      })
      return {
        message: `Товар ${product.title} удален! `,
      }
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }
}
