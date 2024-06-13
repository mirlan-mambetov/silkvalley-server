import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common'
import { Auth } from '../auth/decorators/auth.decorator'
import { CreatePromotionDTO } from './dto/create.promotion.dto'
import { UpdatePromotionDTO } from './dto/update.promotion.dto'
import { PromotionService } from './promotion.service'

@Controller('promo')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Auth(['ADMIN', 'OWNER'])
  create(@Body() dto: CreatePromotionDTO) {
    return this.promotionService.create(dto)
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Auth(['ADMIN', 'OWNER'])
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePromotionDTO,
  ) {
    return this.promotionService.update(id, dto)
  }

  @Get('by-id/:id')
  @HttpCode(HttpStatus.OK)
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.promotionService.findById(id)
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.promotionService.findAll()
  }

  @Get('by-slug/:slug')
  @HttpCode(HttpStatus.OK)
  findBySlug(@Param('slug') slug: string) {
    return this.promotionService.findBySlug(slug)
  }

  @Patch('update-active/:id')
  @HttpCode(HttpStatus.OK)
  @Auth(['ADMIN', 'OWNER'])
  changeActive(
    @Param('id', ParseIntPipe) id: number,
    @Body() { value }: { value: boolean },
  ) {
    return this.promotionService.changeActive(id, value)
  }
}
