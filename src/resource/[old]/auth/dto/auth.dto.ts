import { IsEmail, IsString, Length } from 'class-validator'

export class AuthRegisterDTO {
  @IsString({ message: 'Поле username должен быть в строковом формате!' })
  @Length(2, 255, { message: 'Поле username не может быть пустым' })
  username: string

  @IsEmail({}, { message: 'Введите валидный E-mail' })
  @Length(2, 255, { message: 'Поле E-mail не может быть пустым' })
  email: string

  @Length(2, 255, { message: 'Поле password не может быть пустым' })
  @IsString({ message: 'Поле password должен быть в строковом формате!' })
  password: string
}

export class AuthLoginDTO {
  @IsEmail({}, { message: 'Введите валидный E-mail' })
  @Length(2, 255, { message: 'Поле E-mail не может быть пустым' })
  email: string

  @Length(2, 255, { message: 'Поле password не может быть пустым' })
  @IsString({ message: 'Поле password должен быть в строковом формате!' })
  password: string
}

export class TokenDTO {
  @IsString()
  refreshToken: string
}
