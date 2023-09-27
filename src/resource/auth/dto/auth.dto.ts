import { IsOptional, IsString } from 'class-validator'

export class AuthRegisterDTO {
  @IsString()
  username: string

  @IsString()
  email: string

  @IsString()
  password: string

  @IsOptional()
  @IsString()
  avatar: string
}
