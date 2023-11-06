import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/resource/user/user.service'
import { ProductsService } from '../products.service'
import {
  CreateProductReviewsDTO,
  UpdateProductReviewsDTO,
} from './dto/product.reviews.dto'

@Injectable()
export class ProductReviewsService {
  constructor(
    private readonly prismaSevice: PrismaService,
    private readonly productService: ProductsService,
    private readonly userService: UserService,
  ) {}

  /**
   *
   * @param dto
   * @returns Brand
   * @description Created new Brand
   */
  async create(userId: number, dto: CreateProductReviewsDTO) {
    try {
      const product = await this.productService.getProducById(dto.productId)
      const user = await this.userService.findUserById(userId)

      await this.prismaSevice.products.update({
        where: { id: product.id },
        data: {
          totalReviews: {
            increment: 1,
          },
        },
      })

      const newReview = await this.prismaSevice.productsReviews.create({
        data: {
          description: dto.description,
          productid: product.id,
          userId: user.id,
        },
      })
      return newReview
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
  }

  /**
   *
   * @param name
   * @returns Brand
   */
  async update(reviewId: number, dto: UpdateProductReviewsDTO) {
    try {
      const review = await this.findById(reviewId)
      const updatedReview = await this.prismaSevice.productsReviews.update({
        where: { id: review.id },
        data: {
          description: dto.description,
        },
      })
      return updatedReview
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
  }

  /**
   * @param id
   * @returns Review
   */
  async findById(id: number) {
    try {
      const review = await this.prismaSevice.productsReviews.findUnique({
        where: { id },
      })
      if (!review)
        throw new BadRequestException('Отзыв не найден. Возможно был удален')
      return review
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
  }

  /**
   * @param id
   */
  async delete(id: number) {
    try {
      const review = await this.findById(id)
      if (!review)
        throw new BadRequestException('Отзыв не найден. Удаление невозможно')
      return await this.prismaSevice.productsReviews.delete({ where: { id } })
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
  }
}