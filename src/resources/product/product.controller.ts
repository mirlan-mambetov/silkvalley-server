import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { uploadHelper } from 'src/helpers/upload.helper'
import { CreateProductDTO } from './data-transfer/data.transfer'
import { ProductService } from './product.service'

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file', { ...uploadHelper('product') }))
  async create(@Body() dto: CreateProductDTO) {
    // return this.productService.create(dto)
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  async update() {
    return this.productService.update()
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async delete() {
    return this.productService.delete()
  }

  @Get(':alias')
  @HttpCode(HttpStatus.OK)
  async findOneByAlias() {
    return this.productService.findOneByAlias()
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOneById() {
    return this.productService.findOneById()
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.productService.findAll()
  }

  @Get('similar/:id')
  @HttpCode(HttpStatus.OK)
  async findSimilar() {
    return this.productService.findSimilar()
  }
}
