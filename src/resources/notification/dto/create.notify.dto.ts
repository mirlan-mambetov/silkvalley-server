import { NotificationType } from '@prisma/client'
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateNotifyDto {
  @IsString()
  @IsNotEmpty()
  message: string

  @IsNumber()
  @IsInt()
  @IsNotEmpty()
  userId: number

  @IsEnum(NotificationType)
  @IsNotEmpty()
  type: NotificationType
}
