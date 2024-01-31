import { Controller } from '@nestjs/common'
import { ProductSpecificationService } from './product.specification.service'

@Controller('product-specification')
export class ProductSpecificationController {
  constructor(
    private readonly productSpecificationService: ProductSpecificationService,
  ) {}
}
