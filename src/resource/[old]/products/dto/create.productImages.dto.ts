import { IsString, Length } from 'class-validator'

export class CreateProductImagesDto {
  @IsString()
  @Length(3, 10)
  color: string

  @IsString()
  @Length(5, 500)
  images: string[]
}
