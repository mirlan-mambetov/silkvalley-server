import { UserRoles } from '@prisma/client'
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator'

export class RegisterDTO {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Length(4, 100, {
    message: 'Минимальная длина E-mail 4 и максимальная длина 100',
  })
  email: string

  @IsNotEmpty()
  @Length(4, 100, {
    message: 'Минимальная длина имени 4 и максимальная длина 100',
  })
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  phoneNumber: string

  @IsNotEmpty()
  @Length(3, 20, { message: 'Минимальная длина пароля 3 и максимальная 20' })
  password: string

  @IsOptional()
  @IsString()
  avatar?: string

  @IsEnum(UserRoles)
  @IsOptional()
  role?: UserRoles[]
}
