import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreatePromotionDTO {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsOptional()
  @IsString()
  subtitle?: string

  @IsString()
  @IsNotEmpty()
  image: string

  @IsString()
  @IsOptional()
  description?: string

  @IsInt()
  @IsOptional()
  @IsNumber()
  discount?: number

  @IsNotEmpty()
  @IsArray()
  productsIds: number[]
}
export class GeneratePromotionDataDTO {
  @IsNotEmpty()
  @IsArray()
  productsIds: number[]
}
