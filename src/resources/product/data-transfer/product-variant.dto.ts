import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreateColorDTO {
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  variantId: number

  @IsString()
  @IsNotEmpty()
  color: string

  @IsArray()
  @IsNotEmpty()
  images: string[]
}

export class UpdateColorDTO {
  @IsNotEmpty()
  @IsNumber()
  colorId: number

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  color?: string

  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  images?: string[]
}

export class CreateProductVariantDto {
  @IsNotEmpty()
  price: number

  @IsString()
  @IsOptional()
  size?: string

  @IsNotEmpty()
  stock: number

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
  @IsNotEmpty()
  @IsInt()
  productId: number
}

export class CreateSpecificationDto {
  @IsArray()
  specifications: SpecificationDTO[]
}

export class UpdateSpecificationDto {
  @IsArray()
  specifications: {
    id: number
    name: string
    value: string
  }[]
}

export class SpecificationDTO {
  @IsInt()
  @IsNumber()
  @IsNotEmpty()
  variantId: number

  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  value: string
}
