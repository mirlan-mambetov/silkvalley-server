import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdateProductVariantDto {
  @IsNumber()
  @IsOptional()
  price?: number

  @IsString()
  @IsOptional()
  size?: string

  @IsNumber()
  @IsOptional()
  stock?: number

  @IsNumber()
  @IsOptional()
  discount?: number

  @IsBoolean()
  @IsOptional()
  isHit?: boolean

  @IsBoolean()
  @IsOptional()
  isNew?: boolean

  @IsString()
  @IsOptional()
  video?: string
}
