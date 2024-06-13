import { Injectable } from '@nestjs/common'
import { createSlugName } from 'src/helpers/create.slug-name'
import { PrismaService } from 'src/prisma.service'
import { ProductService } from '../product/product.service'
import { CreatePromotionDTO } from './dto/create.promotion.dto'
import { UpdatePromotionDTO } from './dto/update.promotion.dto'

@Injectable()
export class PromotionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productService: ProductService,
  ) {}

  async create(dto: CreatePromotionDTO) {
    console
    const slug = createSlugName(dto.title)
    const promotion = await this.prismaService.promotion.create({
      data: {
        ...dto,
        slug,
      },
    })
    return promotion
  }

  async update(id: number, dto: UpdatePromotionDTO) {
    let slugName: string
    if (dto.title) {
      slugName = createSlugName(dto.title)
    }
    return await this.prismaService.promotion.update({
      where: { id },
      data: {
        ...dto,
        slug: slugName,
      },
    })
  }

  async findById(id: number) {
    return await this.prismaService.promotion.findUnique({
      where: { id },
      include: { product: true },
    })
  }

  async findAll() {
    return await this.prismaService.promotion.findMany({
      include: { product: true },
    })
  }

  async findBySlug(slug: string) {
    return await this.prismaService.promotion.findUnique({
      where: { slug },
      include: { product: true },
    })
  }

  async changeActive(id: number, value: boolean) {
    return await this.prismaService.promotion.update({
      where: { id },
      data: {
        active: value,
      },
    })
  }
}
