import { IsString } from 'class-validator'

export class RegisterDTO {
  @IsString()
  email: string
}
