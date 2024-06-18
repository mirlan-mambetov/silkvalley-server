import { IsInt, IsOptional, IsString } from 'class-validator'
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

  @IsInt()
  @IsOptional()
  categoryId?: number
}
