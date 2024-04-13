import { EnumStatusOrder } from '@prisma/client'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class IPlaceOrderDTO {
  status: EnumStatusOrder

  products: IOrderProducts[]

  @IsNumber()
  totalPrice: number
}

export class IOrderProducts {
  @IsNumber()
  id: number

  @IsString()
  title: string

  @IsString()
  description: string

  @IsNumber()
  productQuantity: number

  @IsNumber()
  price: number

  @IsString()
  poster: string

  @IsString()
  @IsOptional()
  selectedColor?: string

  @IsString()
  @IsOptional()
  selectedSize?: string
}
