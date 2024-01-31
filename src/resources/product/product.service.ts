import { Injectable } from '@nestjs/common'
import slugify from 'slugify'
import { PrismaService } from 'src/prisma.service'
import { v4 as uuid } from 'uuid'
import { CreateProductDTO } from './data-transfer/data.transfer'

@Injectable()
export class ProductService {
  constructor(private readonly prismaSevice: PrismaService) {}

  // CREATE PRODUCT
  async create(dto: CreateProductDTO, posterPath: string) {
    // generate slug (alias)
    const aliasName = slugify(dto.title, { lower: true, locale: 'eng' })
    // generate article uniqeu ID PRODUCT
    const PRODUCT_ID = uuid()
    return await this.prismaSevice.product.create({
      data: {
        alias: aliasName,
        article: +PRODUCT_ID,
        description: dto.description.trim(),
        poster: posterPath,
        price: +dto.price,
        subtitle: dto.subtitle.trim(),
        title: dto.title.trim(),
        discount: dto.discount || null,
        isHit: dto.isHit || false,
        isNew: dto.isNew || false,
        rating: dto.rating || null,
        video: dto.video || null,
      },
    })
  }

  async update() {}

  async delete() {}

  async findOneByAlias() {}

  async findOneById() {}

  async findAll() {}

  async findSimilar() {}
}
