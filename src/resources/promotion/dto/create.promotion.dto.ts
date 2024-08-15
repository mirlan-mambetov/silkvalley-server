import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'

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
  @IsNotEmpty()
  imageSm: string

  @IsString()
  @IsOptional()
  description?: string
}
export class GeneratePromotionDataDTO {
  @IsNotEmpty()
  @IsArray()
  productsIds: number[]
}
