import { EnumTypeNotification } from '@prisma/client'

export class CreateNotifyDto {
  text: string
  userId: number
  typeOfNotification: EnumTypeNotification
}
