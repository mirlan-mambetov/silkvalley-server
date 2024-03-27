import { IsNotEmpty, IsString } from 'class-validator'

export class CreateChildCategoryDTO {
  @IsString()
  @IsNotEmpty()
  // @Length(4, 16, {
  //   message: 'Минимальная длина названии 4 и максимальная 16символов',
  // })
  name: string
}
