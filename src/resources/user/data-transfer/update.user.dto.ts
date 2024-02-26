import { UserRoles } from '@prisma/client'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  email?: string

  @IsOptional()
  @IsNumber()
  phoneNumber?: number

  @IsOptional()
  @IsString()
  password?: string

  @IsString()
  @IsOptional()
  avatar?: string

  @IsOptional()
  @IsEnum(UserRoles)
  role?: UserRoles[]
}
