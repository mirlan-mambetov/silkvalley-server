import { IsArray, IsOptional, IsString } from 'class-validator'

export class UpdateProductImageDTO {
  @IsOptional()
  @IsString()
  color: string

  @IsOptional()
  @IsArray()
  image: string[]
}
