import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { Auth } from 'src/resource/auth/decarators/auth.decarator'
import { CurrentUser } from 'src/resource/user/decarators/current.user'
import {
  CreateProductReviewsDTO,
  UpdateProductReviewsDTO,
} from './dto/product.reviews.dto'
import { ProductReviewsService } from './product.reviews.service'

@Controller('product-reviews')
export class ProductReviewsController {
  constructor(private readonly productReviewService: ProductReviewsService) {}

  /**
   *
   * @param userId
   * @param dto
   * @returns Review
   */
  @Post()
  @Auth()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser('id') userId: number,
    @Body() dto: CreateProductReviewsDTO,
  ) {
    return await this.productReviewService.create(+userId, dto)
  }

  /**
   *
   * @param userId
   * @param dto
   * @returns Review
   */
  @Put(':id')
  @Auth()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductReviewsDTO,
  ) {
    return await this.productReviewService.update(id, dto)
  }

  /**
   * @param userId
   */
  @Delete(':id')
  @Auth()
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.productReviewService.delete(id)
  }
}
