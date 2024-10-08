import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { generateSlug } from 'utils/generate-slug'
import { ProductService } from '../product/product.service'
import { UploadService } from '../upload/upload.service'
import {
  CreatePromotionDTO,
  GeneratePromotionDataDTO,
} from './dto/create.promotion.dto'
import { DeleteImageDTO } from './dto/delete.image.dto'
import {
  AddProductDTO,
  RemoveProductDTO,
  UpdatePromotionDTO,
} from './dto/update.promotion.dto'

@Injectable()
export class PromotionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productService: ProductService,
    private readonly uploadService: UploadService,
  ) {}

  /**
   *
   * @param dto
   * @returns
   */
  async generatePromotionData(dto: GeneratePromotionDataDTO) {
    const { productsIds } = dto

    const maxDiscount = await this.prismaService.productVariant.aggregate({
      where: {
        id: {
          in: productsIds,
        },
      },
      _max: {
        discount: true,
      },
    })

    return {
      discount: maxDiscount._max.discount,
    }
  }

  /**
   *
   * @param dto
   * @returns
   */
  async create(dto: CreatePromotionDTO) {
    const slug = generateSlug(dto.title)
    await this.prismaService.promotion.create({
      data: {
        description: dto.description,
        subtitle: dto.subtitle,
        image: dto.image,
        imageSm: dto.imageSm,
        title: dto.title,
        slug,
      },
    })
    return {
      message: 'Акция создана',
    }
  }

  /**
   *
   * @param id
   * @param dto
   * @returns
   */
  async update(id: number, dto: UpdatePromotionDTO) {
    await this.prismaService.promotion.update({
      where: { id },
      data: {
        ...dto,
      },
    })
    return {
      message: 'Успешно обновлено',
    }
  }

  /**
   *
   * @param id
   * @param dto
   * @returns
   */
  async addProducts(id: number, dto: AddProductDTO) {
    const maxDiscount = await this.generatePromotionData(dto)
    await this.prismaService.promotion.update({
      where: { id },
      data: {
        discount: maxDiscount.discount,
        active: true,
        product: {
          connect: dto.productsIds.map((productId) => ({ id: productId })),
        },
      },
    })
    return {
      message: 'Товары добавлены',
    }
  }

  /**
   *
   * @param productId
   * @returns DELETED PRODUCT FROM PROMOTION
   */
  async removeProduct(dto: RemoveProductDTO) {
    // UPDATE PRODUCT REMOVE CONNECTION
    await this.productService.update(dto.productId, {
      promotionId: null,
    })

    const promo = await this.findById(dto.id)
    if (!promo.product.length) {
      await this.update(promo.id, {
        active: false,
      })
    }
    return {
      message: 'Товар убран с акции',
    }
  }

  /**
   *
   * @param id
   * @returns
   */
  async findById(id: number) {
    return await this.prismaService.promotion.findUnique({
      where: { id },
      include: {
        product: {
          include: {
            variants: true,
          },
        },
      },
    })
  }

  /**
   *
   * @returns ALL PROMOTIONS
   */
  async findAll() {
    return await this.prismaService.promotion.findMany({
      include: { product: true },
    })
  }

  /**
   *
   * @returns ALL
   */
  async findActives() {
    return await this.prismaService.promotion.findMany({
      where: {
        active: true,
      },
      include: { product: true },
    })
  }

  /**
   *
   * @param slug
   * @returns
   */
  async findBySlug(slug: string) {
    return await this.prismaService.promotion.findUnique({
      where: { slug },
      include: {
        product: {
          include: {
            categories: {
              include: {
                category: {
                  include: {
                    childs: true,
                  },
                },
              },
            },
            variants: true,
          },
        },
      },
    })
  }

  /**
   *
   * @param id
   * @param value
   * @returns
   */
  async changeActive(id: number, value: boolean) {
    await this.prismaService.promotion.update({
      where: { id },
      data: {
        active: value,
      },
    })
    return {
      message: 'Изменено',
    }
  }

  async deleteImage(dto: DeleteImageDTO) {
    const { id, path } = dto
    const promo = await this.findById(id)
    let image: string | null = null
    let imageSm: string | null = null

    if (promo.image.includes(path)) {
      image = promo.image
    } else if (promo.imageSm.includes(path)) {
      imageSm = promo.imageSm
    }

    if (image) {
      await this.update(id, { image: '' })
      await this.uploadService.deleteFile(image)
      return {
        message: 'Файл удален',
      }
    } else if (imageSm) {
      await this.update(id, { imageSm: '' })
      await this.uploadService.deleteFile(imageSm)
      return {
        message: 'Файл удален',
      }
    }
    return {
      message: 'Не удалось удалить файл',
    }
  }
}
