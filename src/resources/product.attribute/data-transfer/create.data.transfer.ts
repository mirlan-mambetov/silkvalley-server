import { IsNotEmpty, IsString } from 'class-validator'

export class ICreateAttributeDTO {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  value: string
}
