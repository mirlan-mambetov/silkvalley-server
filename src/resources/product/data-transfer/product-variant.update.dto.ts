import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import { ColorsDTO, CreateSpecificationDto } from './product-variant.dto'

export class UpdateProductVariantDto {
  @IsArray()
  @IsOptional()
  color?: ColorsDTO

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

  @IsArray()
  @IsOptional()
  specifications?: CreateSpecificationDto

  @IsNumber()
  @IsInt()
  @IsOptional()
  colorId: number

  @IsNumber()
  @IsInt()
  @IsOptional()
  specificationId: number
}
