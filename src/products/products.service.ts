import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { generateSlug } from 'utils/generate-slug'
import { CreateProductDTO } from './dto/create.product.dto'

@Injectable()
export class ProductsService {
  constructor(private readonly Prisma: PrismaService) {}

  // CREATE PRODUCT
  async createProduct(dto: CreateProductDTO) {
    const { description, images, attributes, poster, price, title } = dto

    // GENERATE SLUG FOR PRODUCT
    const { cleanedName } = generateSlug(title)
    const product = await this.Prisma.products.create({
      data: {
        description,
        poster,
        price,
        slug: cleanedName,
        images,
        title,
        attributes: {
          create: {
            colors: attributes.colors,
            sizes: attributes.sizes,
          },
        },
      },
    })
    return product
  }
}
