import { EnumProductType } from '@prisma/client'
import { IsEnum, IsNumber, IsOptional, IsString, Length } from 'class-validator'

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

  @IsOptional()
  @IsNumber()
  brandId?: number

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

  @IsEnum(EnumProductType)
  productType: EnumProductType
}
