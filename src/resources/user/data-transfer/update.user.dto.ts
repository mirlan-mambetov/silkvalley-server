import { UserRoles } from '@prisma/client'
import { IsEnum, IsOptional, IsString } from 'class-validator'

export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  email?: string

  @IsOptional()
  @IsString()
  phoneNumber?: string

  @IsOptional()
  @IsString()
  password?: string

  @IsString()
  @IsOptional()
  avatar?: string

  @IsEnum(UserRoles, { each: true })
  @IsOptional()
  role?: UserRoles[]
}
