import { UserRoles } from '@prisma/client'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'

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

  @IsEnum(UserRoles)
  @IsOptional()
  role?: UserRoles[]
}
