import { EnumStatusOrder } from '@prisma/client'
import { IsEnum } from 'class-validator'

export class ChangeStatusDTO {
  @IsEnum(EnumStatusOrder)
  status: EnumStatusOrder
}

export class QueryParams {
  order: string
}
