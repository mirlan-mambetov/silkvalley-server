import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class UpdatePromotionDTO {
  @IsString()
  @IsOptional()
  title?: string

  @IsOptional()
  @IsString()
  subtitle?: string

  @IsString()
  @IsOptional()
  image?: string

  @IsString()
  @IsOptional()
  imageSm?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsOptional()
  @IsNumber()
  discount?: number

  @IsBoolean()
  @IsOptional()
  active?: boolean
}

export class AddProductDTO {
  @IsArray({ each: true })
  @IsNotEmpty()
  productsIds: number[]
}

export class RemoveProductDTO {
  @IsNotEmpty()
  @IsNumber()
  id: number

  @IsNotEmpty()
  @IsNumber()
  productId: number
}
