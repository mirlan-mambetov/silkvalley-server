import { IsNumber, IsString, Length } from 'class-validator'

export class CategoryDTO {
  @IsString()
  @Length(2, 500, {
    message: 'Минимальная длина категории 2 и максимальная 500 символов',
  })
  name: string
}

export class ProductCategoryDTO {
  @IsString()
  @Length(2, 500, {
    message: 'Минимальная длина категории 2 и максимальная 500 символов',
  })
  name: string

  @IsNumber()
  categoryId: number
}
