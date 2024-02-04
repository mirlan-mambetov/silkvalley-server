import { Injectable } from '@nestjs/common'
import slugify from 'slugify'
import { generateProductId } from 'src/helpers/generate.id'
import { PrismaService } from 'src/prisma.service'
import { CreateProductDTO } from './data-transfer/data.transfer'
import { returnProductFields } from './objects/return.product.fields'

@Injectable()
export class ProductService {
  constructor(private readonly prismaSevice: PrismaService) {}

  /**
   *
   * @param dto
   * @param posterPath
   * @returns CREATED PRODUCT
   * @description CREATE PRODUCT WITH DTO
   */
  async create(dto: CreateProductDTO, posterPath: string) {
    // generate slug (alias)
    const aliasName = slugify(dto.title, { lower: true, locale: 'eng' })
    // generate article uniqeu ID PRODUCT
    const PRODUCT_ID = generateProductId()

    return await this.prismaSevice.product.create({
      data: {
        alias: aliasName,
        description: dto.description.trim(),
        poster: posterPath,
        price: +dto.price,
        subtitle: dto.subtitle.trim().toLowerCase(),
        title: dto.title.trim(),
        discount: dto.discount || null,
        isHit: dto.isHit || false,
        isNew: dto.isNew || false,
        rating: dto.rating || null,
        video: dto.video || null,
        article: PRODUCT_ID,
      },
    })
  }

  async update() {}

  async delete() {}

  async findOneByAlias() {}

  async findOneById() {}

  async findAll() {
    return await this.prismaSevice.product.findMany(returnProductFields)
  }

  async findSimilar() {}
}
