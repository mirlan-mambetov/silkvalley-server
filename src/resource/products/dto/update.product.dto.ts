import { EnumProductType } from '@prisma/client'
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator'

export class UpdateProductDTO {
  @IsOptional()
  @IsString()
  @Length(5, 255)
  title?: string

  @IsOptional()
  @IsString()
  @Length(5, 5000)
  description?: string

  @IsOptional()
  @IsString()
  @Length(5, 500)
  poster?: string

  @IsOptional()
  @IsNumber()
  price?: number

  @IsOptional()
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

  @IsOptional()
  @IsNumber()
  categoryId?: number

  @IsBoolean()
  @IsOptional()
  exclusive?: boolean

  @IsOptional()
  @IsEnum(EnumProductType)
  productType: EnumProductType
}
