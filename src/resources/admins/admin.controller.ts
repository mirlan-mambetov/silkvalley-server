import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { AdminService } from './admin.service'
import { AdminDTO } from './data-transfer/data.transfer'

@Controller('admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: AdminDTO) {
    return await this.adminService.create(dto)
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: AdminDTO) {
    return await this.adminService.update(id, dto)
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.adminService.findAll()
  }

  @Get('by-id/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.adminService.findById(id)
  }

  @Get('by-email/:email')
  @HttpCode(HttpStatus.OK)
  async findByEmail(@Param('email') email: string) {
    return await this.adminService.findByEmail(email)
  }
}
