import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreatePromotionDTO {
  @IsString()
  title: string

  @IsOptional()
  subtitle?: string

  @IsString()
  image: string

  @IsString()
  description?: string

  @IsOptional()
  @IsNumber()
  discount?: number

  @IsBoolean()
  @IsOptional()
  active?: boolean
}
