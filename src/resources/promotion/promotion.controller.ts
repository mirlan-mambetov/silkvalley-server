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
import {
  CreatePromotionDTO,
  GeneratePromotionDataDTO,
} from './dto/create.promotion.dto'
import {
  AddProductDTO,
  RemoveProductDTO,
  UpdatePromotionDTO,
} from './dto/update.promotion.dto'
import { PromotionService } from './promotion.service'

@Controller('promo')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Post('generate')
  @HttpCode(HttpStatus.CREATED)
  @Auth(['ADMIN', 'OWNER'])
  generatePromotionData(@Body() dto: GeneratePromotionDataDTO) {
    return this.promotionService.generatePromotionData(dto)
  }

  /**
   * @description CREATE PROMOTION
   */
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

  @Post('add-products/:id')
  @HttpCode(HttpStatus.CREATED)
  @Auth(['ADMIN', 'OWNER'])
  addProducts(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddProductDTO,
  ) {
    return this.promotionService.addProducts(id, dto)
  }

  /**
   *
   * @param dto
   * @returns Deleted product from promotion
   */
  @Post('remove-product')
  @HttpCode(HttpStatus.CREATED)
  @Auth(['ADMIN', 'OWNER'])
  removeProduct(@Body() dto: RemoveProductDTO) {
    return this.promotionService.removeProduct(dto)
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

  @Get('activity')
  @HttpCode(HttpStatus.OK)
  findAllActivity() {
    return this.promotionService.findActives()
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
