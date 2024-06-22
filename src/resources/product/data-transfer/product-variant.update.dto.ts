import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdateProductVariantDto {
  @IsNumber()
  @IsOptional()
  price?: number

  @IsString()
  @IsOptional()
  size?: string

  @IsNumber()
  @IsOptional()
  stock?: number

  @IsNumber()
  @IsOptional()
  rating?: number

  @IsNumber()
  @IsOptional()
  discount?: number

  @IsBoolean()
  @IsOptional()
  isHit?: boolean

  @IsBoolean()
  @IsOptional()
  isNew?: boolean

  @IsNumber()
  @IsOptional()
  sales?: number

  @IsString()
  @IsOptional()
  video?: string

  @IsNumber()
  @IsOptional()
  promotionId?: number

  @IsNumber()
  @IsOptional()
  productId?: number
}
