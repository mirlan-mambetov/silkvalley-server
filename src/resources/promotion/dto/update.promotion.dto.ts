import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdatePromotionDTO {
  @IsString()
  @IsOptional()
  title?: string

  @IsOptional()
  @IsString()
  subtitle?: string

  @IsString()
  @IsOptional()
  image?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsOptional()
  @IsNumber()
  discount?: number

  @IsBoolean()
  @IsOptional()
  active?: boolean
}
