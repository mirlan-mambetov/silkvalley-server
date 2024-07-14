import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { Auth } from '../auth/decorators/auth.decorator'
import { ChangeStatusDTO, QueryParams } from './dto/change.status.dto'
import { OrderService } from './order.service'

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Auth(['ADMIN', 'OWNER'])
  findAll() {
    return this.orderService.findAll()
  }

  @Get('query')
  @HttpCode(HttpStatus.OK)
  @Auth()
  findByOrderId(@Query() query: QueryParams) {
    console.log(query)
    return this.orderService.findByOrderId(query.order)
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Auth(['ADMIN', 'OWNER'])
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
    return this.orderService.changeStatus(id, dto)
  }
}
