import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator'
import { EnumUserRole } from 'src/enums/User.enum'

export class AdminDTO {
  @IsString()
  name: string

  @IsEmail()
  @IsString()
  email: string

  @IsString()
  phoneNumber: string

  @IsString()
  password: string

  @IsString()
  avatar: string

  @IsEnum(EnumUserRole, { each: true })
  role: EnumUserRole[]
}

export class AdminUpdateDTO {
  @IsOptional()
  @IsString()
  name: string

  @IsOptional()
  @IsEmail()
  @IsString()
  email: string

  @IsOptional()
  @IsString()
  phoneNumber: string

  @IsOptional()
  @IsString()
  password: string

  @IsOptional()
  @IsString()
  avatar: string

  @IsOptional()
  @IsEnum(EnumUserRole, { each: true })
  role: EnumUserRole[]
}
