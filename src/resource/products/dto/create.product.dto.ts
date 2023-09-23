import { IsNumber, IsOptional, IsString, Length } from 'class-validator'

export class CreateProductDTO {
  @IsString()
  @Length(5, 255)
  title?: string

  @IsString()
  @Length(5, 5000)
  description?: string

  @IsString()
  @Length(5, 500)
  poster?: string

  @IsNumber()
  price?: number

  @IsString()
  @Length(2, 255)
  brand?: string

  @IsString()
  @Length(2, 255)
  @IsOptional()
  video?: string

  @IsOptional()
  @IsNumber()
  discount?: number

  @IsOptional()
  @IsNumber()
  rating?: number

  @IsNumber()
  categoryId: number
}
