import { Injectable } from '@nestjs/common'
import { createSlugName } from 'src/helpers/create.slug-name'
import { PrismaService } from 'src/prisma.service'
import { ProductService } from '../product/product.service'
import {
  CreatePromotionDTO,
  GeneratePromotionDataDTO,
} from './dto/create.promotion.dto'
import { UpdatePromotionDTO } from './dto/update.promotion.dto'

@Injectable()
export class PromotionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productService: ProductService,
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
    const slug = createSlugName(dto.title)
    await this.prismaService.promotion.create({
      data: {
        description: dto.description,
        subtitle: dto.subtitle,
        image: dto.image,
        title: dto.title,
        slug,
        product: {
          connect: dto.productsIds.map((ids) => ({ id: ids })),
        },
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
    return await this.prismaService.promotion.update({
      where: { id },
      data: {
        ...dto,
      },
    })
  }

  /**
   *
   * @param id
   * @returns
   */
  async findById(id: number) {
    return await this.prismaService.promotion.findUnique({
      where: { id },
      include: { product: true },
    })
  }

  /**
   *
   * @returns ALL
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
}
