import { IsNumber, IsString, Length } from 'class-validator'

export class CreateProductReviewsDTO {
  @IsString()
  @Length(2, 255)
  description: string

  @IsNumber()
  productId: number
}

export class UpdateProductReviewsDTO {
  @IsString()
  @Length(2, 255)
  description: string
}
