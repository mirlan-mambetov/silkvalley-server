import { IsArray, IsInt, IsNotEmpty, IsString, Length } from 'class-validator'
// product.dto.ts

export class CreateProductDto {
  @IsString()
  @Length(5, 300, {
    message:
      'Минимальная длина для названия товара 12 и максимальная 300 символов',
  })
  title: string

  @IsString()
  @IsNotEmpty({ message: 'Введите подзаголовок' })
  subtitle: string

  @IsString()
  @Length(12, 300, {
    message: 'Минимальная длина для описания 12 и максимальная 300 символов',
  })
  description: string

  @IsString()
  @IsNotEmpty({ message: 'Постер обязателен' })
  poster: string

  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty({ message: 'Введите принадлежность для категории' })
  categoryIds?: number[]
}
