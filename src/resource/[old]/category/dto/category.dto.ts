import { IsNumber, IsOptional, IsString, Length } from 'class-validator'

export class CategoryDTO {
  @IsOptional()
  @IsString()
  @Length(2, 500, {
    message: 'Минимальная длина категории 2 и максимальная 500 символов',
  })
  name: string

  @IsOptional()
  @Length(2, 500, {
    message: 'Минимальная длина иконки 4 и максимальная 500 символов',
  })
  icon?: string
}

export class ProductCategoryDTO {
  @IsString()
  @Length(2, 500, {
    message: 'Минимальная длина категории 2 и максимальная 500 символов',
  })
  name: string

  @IsOptional()
  @IsNumber()
  categoryId?: number

  @IsOptional()
  @Length(2, 500, {
    message: 'Минимальная длина иконки 4 и максимальная 500 символов',
  })
  icon?: string
}
