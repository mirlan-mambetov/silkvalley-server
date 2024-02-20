import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator'

export class CreateProductDTO {
  @IsNotEmpty({ message: 'Название обязательна' })
  @Length(5, 350, {
    message: 'Минимальная длина названии товара 5 символов. Максимальная 350',
  })
  @IsString({ message: 'Название товара не может быть пустым' })
  title: string

  @IsNotEmpty({ message: 'Подзаголовок обязательна' })
  @Length(5, 350, {
    message:
      'Минимальная длина подзаголовока товара 5 символов. Максимальная 350',
  })
  @IsString({ message: 'Подзаголовок не может быть пустым' })
  subtitle: string

  @IsNotEmpty({ message: 'Описание обязательна' })
  @Length(10, 500, {
    message: 'Минимальная длина описание товара 10 символов. Максимальная 500',
  })
  @IsString({ message: 'Описание товара не может быть пустым' })
  description: string

  @IsNotEmpty({ message: 'Цена обязательна' })
  @IsNumber()
  price: number

  @IsNotEmpty({ message: 'Изображение обязательна' })
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
  mainCategoryId?: number

  @IsOptional()
  @IsNumber()
  childCategoryId?: number
}
