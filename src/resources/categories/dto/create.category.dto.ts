import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator'

export class CreateCategoryDTO {
  @IsString()
  @IsNotEmpty()
  @Length(4, 255, {
    message: 'Минимальная длина названии 4 и максимальная 255символов',
  })
  name: string
}

export class CreateChildDTO {
  @IsString()
  @IsNotEmpty()
  @Length(4, 255, {
    message: 'Минимальная длина названии 4 и максимальная 255символов',
  })
  name: string

  @IsNumber()
  parentId: number
}
