import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateProductDTO {
  @IsString({ message: 'Название товара не может быть пустым' })
  title: string

  @IsString({ message: 'Подзаголовок не может быть пустым' })
  subtitle: string

  @IsString({ message: 'Описание товара не может быть пустым' })
  description: string

  @IsString({ message: 'Цена товара не может быть пустым' })
  price: number

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
}
