import { UserRoles } from '@prisma/client'
import { IsEnum, IsOptional, IsString } from 'class-validator'

export class CreateUserDTO {
  @IsString()
  name: string

  @IsString()
  email: string

  @IsString()
  phoneNumber: string

  @IsString()
  password: string

  @IsString()
  @IsOptional()
  avatar: string

  @IsEnum(UserRoles, { each: true })
  @IsOptional()
  role?: UserRoles[]
}
