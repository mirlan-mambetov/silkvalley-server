import { IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateUserDTO {
  @IsString()
  name: string

  @IsString()
  email: string

  @IsNumber()
  phoneNumber: number

  @IsString()
  password: string

  @IsString()
  @IsOptional()
  avatar: string
}
