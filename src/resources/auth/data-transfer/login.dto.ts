import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator'

export class LoginDTO {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Length(4, 50, { message: 'Минимальная длина E-mail 4 и максимальная 20' })
  email: string

  @IsString()
  @IsNotEmpty()
  @Length(3, 20, { message: 'Минимальная длина пароля 3 и максимальная 20' })
  password: string
}
