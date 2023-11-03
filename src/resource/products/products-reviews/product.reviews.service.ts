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
    private readonly PrismaService: PrismaService,
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

      const newReview = await this.PrismaService.productsReviews.create({
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
      const updatedReview = await this.PrismaService.productsReviews.update({
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
      const review = await this.PrismaService.productsReviews.findUnique({
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
      return await this.PrismaService.productsReviews.delete({ where: { id } })
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
  }
}
