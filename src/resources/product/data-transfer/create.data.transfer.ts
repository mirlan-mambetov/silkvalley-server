import { IsInt, IsString } from 'class-validator'
// product.dto.ts

export class CreateProductDto {
  @IsString()
  title: string

  @IsString()
  subtitle: string

  @IsString()
  description: string

  @IsString()
  poster: string

  @IsInt()
  categoryId: number
}
