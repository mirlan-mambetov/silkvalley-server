import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class SearchService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   *
   * @param searchTerm
   * @returns SEARCHED PRODUCTS
   */
  async searchProducts(searchTerm: string) {
    return await this.prismaService.product.findMany({
      where: {
        OR: [
          {
            categories: {
              some: {
                category: {
                  name: {
                    contains: searchTerm,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
          {
            title: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        categories: {
          where: {
            category: {
              parentId: null,
            },
          },
          select: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        variants: {
          include: {
            color: true,
            specifications: true,
          },
        },
      },
    })
  }
}
