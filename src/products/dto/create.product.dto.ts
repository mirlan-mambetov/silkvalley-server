import { IsNumber, IsOptional, IsString, Length } from 'class-validator'

export class CreateProductDTO {
  @IsString()
  @Length(5, 255)
  title: string

  @IsString()
  @Length(5, 5000)
  description: string

  images: {
    color: string
    images: string[]
  }[]

  @IsString()
  @Length(5, 500)
  poster: string

  @IsNumber()
  price: number

  @IsOptional()
  @IsString()
  @Length(2, 255)
  brand?: string

  @IsOptional()
  attributes?: {
    colors: string[]
    sizes: string[]
  }
}
