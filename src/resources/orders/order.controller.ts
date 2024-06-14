import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { Auth } from '../auth/decorators/auth.decorator'
import { ChangeStatusDTO } from './dto/change.status.dto'
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

  @Get('by-orderId/:orderid')
  @HttpCode(HttpStatus.OK)
  @Auth()
  findByOrderId(@Param('orderid') orderid: string) {
    console.log(orderid)
    return this.orderService.findByOrderId(orderid)
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Auth()
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findById(id)
  }

  @Post(':id')
  @HttpCode(HttpStatus.OK)
  @Auth(['ADMIN', 'OWNER'])
  @UsePipes(new ValidationPipe())
  changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangeStatusDTO,
  ) {
    console.log(dto)
    return this.orderService.changeStatus(id, dto)
  }
}
