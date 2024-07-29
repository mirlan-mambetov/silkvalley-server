import { IsArray, IsInt, IsNumber, IsOptional, IsString } from 'class-validator'
// product.dto.ts

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  subtitle?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsOptional()
  poster?: string

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  categoryIds?: number[]

  @IsNumber()
  @IsOptional()
  promotionId?: number
}
