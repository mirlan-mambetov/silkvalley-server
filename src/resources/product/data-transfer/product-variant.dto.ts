// product-variant.dto.ts

import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
export class ColorsDTO {
  @IsString()
  @IsNotEmpty()
  color: string

  @IsArray()
  @IsNotEmpty()
  images: string[]
}
export class CreateProductVariantDto {
  @IsArray()
  color: ColorsDTO[]

  @IsNumber()
  @IsNotEmpty()
  price: number

  @IsString()
  @IsNotEmpty()
  size: string

  @IsNumber()
  @IsNotEmpty()
  stock: number

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
  @IsNotEmpty()
  productId: number

  @IsArray()
  @IsNotEmpty()
  specifications: CreateSpecificationDto[]
}
export class CreateSpecificationDto {
  @IsString()
  name: string

  @IsString()
  value: string
}
