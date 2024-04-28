import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdateProductDTO {
  @IsOptional()
  @IsString({ message: 'Название товара не может быть пустым' })
  title: string

  @IsOptional()
  @IsString({ message: 'Подзаголовок не может быть пустым' })
  subtitle: string

  @IsOptional()
  @IsString({ message: 'Описание товара не может быть пустым' })
  description: string

  @IsOptional()
  @IsString({ message: 'Цена товара не может быть пустым' })
  price: number

  @IsOptional()
  @IsString({ message: 'Выберите изображение для постера!' })
  poster: string

  @IsOptional()
  @IsNumber()
  rating?: number

  @IsOptional()
  @IsString()
  video?: string

  @IsOptional()
  @IsNumber()
  discount?: number

  @IsOptional()
  @IsBoolean()
  isHit?: boolean

  @IsOptional()
  @IsBoolean()
  isNew?: boolean

  @IsOptional()
  @IsNumber()
  quantity?: number

  @IsOptional()
  @IsNumber()
  categoryId?: number

  @IsOptional()
  @IsNumber()
  secondCategoryId?: number

  @IsOptional()
  @IsNumber()
  childsCategoryId?: number
}
