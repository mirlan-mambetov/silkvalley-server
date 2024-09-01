import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator'
import { EnumProductSort } from 'src/enums/Filter.enum'

export class QueryFilterDTO {
  sort?: EnumProductSort

  @IsNumber()
  @IsNotEmpty()
  category: number

  @IsOptional()
  color?: string

  @IsOptional()
  size?: string
}
