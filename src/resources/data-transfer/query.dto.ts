import { IsInt, IsNumber } from 'class-validator'
import { EnumProductSort } from 'src/enums/Filter.enum'

export class QueryDTO {
  sort?: EnumProductSort

  @IsInt()
  @IsNumber()
  category?: number
}
