import { IsArray, IsNotEmpty, IsString } from 'class-validator'

export class CreateAttributeDTO {
  @IsNotEmpty()
  @IsString()
  color: string

  @IsNotEmpty()
  @IsString()
  size: string

  @IsArray()
  images: string[]
}
