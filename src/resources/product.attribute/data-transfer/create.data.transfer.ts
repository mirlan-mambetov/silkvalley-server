import { IsArray, IsOptional, IsString } from 'class-validator'

export class CreateAttributeDTO {
  @IsOptional()
  @IsString()
  color?: string

  @IsOptional()
  @IsString()
  size?: string

  @IsArray()
  images: string[]
}
