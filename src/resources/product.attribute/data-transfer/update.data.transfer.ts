import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class IUpdateAttributeDTO {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  color?: string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  size?: string

  @IsOptional()
  @IsArray()
  images?: string[]
}
