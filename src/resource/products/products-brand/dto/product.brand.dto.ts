import { IsOptional, IsString, Length } from 'class-validator'

export class ProductBrandDTO {
  @IsString()
  @Length(2, 255)
  name: string

  @IsOptional()
  @IsString()
  description: string
}
