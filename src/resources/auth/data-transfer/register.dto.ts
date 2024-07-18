import { IsNotEmpty, IsString } from 'class-validator'

export class RegisterDTO {
  @IsString()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsString()
  @IsNotEmpty()
  phoneNumber: string
}
