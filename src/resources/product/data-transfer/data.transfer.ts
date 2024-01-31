import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateProductDTO {
  @IsString()
  title: string

  @IsString()
  subtitle: string

  @IsString()
  description: string

  @IsNumber()
  price: number

  @IsOptional()
  @IsNumber()
  rating?: number

  @IsOptional()
  @IsString()
  video?: string

  @IsOptional()
  @IsNumber()
  discount?: number

  @IsOptional()
  @IsBoolean()
  isHit?: boolean

  @IsOptional()
  @IsBoolean()
  isNew?: boolean
}
