import { IsString } from 'class-validator'

export class productDimensionsDTO {
  @IsString()
  form_factors: string

  @IsString()
  packing_size: string

  @IsString()
  color_packing: string
}
