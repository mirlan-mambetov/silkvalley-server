import { IsArray, IsString } from 'class-validator'

export class CreateProductImageDTO {
  @IsString()
  color: string

  @IsArray()
  image: string[]
}
