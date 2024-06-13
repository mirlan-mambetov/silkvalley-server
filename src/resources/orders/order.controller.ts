import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
} from '@nestjs/common'
import { Auth } from '../auth/decorators/auth.decorator'
import { OrderService } from './order.service'

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Auth(['OWNER'])
  findAll() {
    return this.orderService.findAll()
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Auth()
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findById(id)
  }
}
