import { IsNotEmpty, IsString, Length } from 'class-validator'

export class UpdateCategoryDTO {
  @IsString()
  @IsNotEmpty()
  @Length(4, 16, {
    message: 'Минимальная длина названии 4 и максимальная 16символов',
  })
  name: string
}
