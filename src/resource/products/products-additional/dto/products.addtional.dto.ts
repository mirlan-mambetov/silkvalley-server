import { IsString, Length } from 'class-validator'

export class ProductsAdditionalDTO {
  @IsString()
  @Length(2, 255)
  name: string

  @IsString()
  @Length(1, 255)
  value: string
}
