import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator'

export class RegisterDTO {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Length(4, 20, { message: 'Минимальная длина E-mail 4 и максимальная 20' })
  email: string

  @IsNotEmpty()
  @Length(4, 20, { message: 'Минимальная длина имени 4 и максимальная 20' })
  @IsString()
  name: string

  @IsNotEmpty()
  @IsNumber()
  phoneNumber: number

  @IsNotEmpty()
  @Length(3, 20, { message: 'Минимальная длина пароля 3 и максимальная 20' })
  password: string

  @IsOptional()
  @IsString()
  avatar?: string
}
