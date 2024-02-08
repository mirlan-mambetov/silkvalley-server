import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class IUpdateAttributeDTO {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name: string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  value: string
}
