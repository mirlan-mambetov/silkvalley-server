import { IsInt, IsNumber, IsOptional } from 'class-validator'
import { EnumProductSort } from 'src/enums/Filter.enum'

export class QueryFilterDTO {
  sort?: EnumProductSort

  @IsInt()
  @IsNumber()
  category?: number

  @IsOptional()
  color?: string

  @IsOptional()
  size?: string
}
