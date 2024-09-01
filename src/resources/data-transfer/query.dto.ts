import { IsNotEmpty, IsOptional } from 'class-validator'
import { EnumProductSort } from 'src/enums/Filter.enum'

export class QueryFilterDTO {
  sort?: EnumProductSort

  @IsNotEmpty()
  category: number

  @IsOptional()
  color?: string

  @IsOptional()
  size?: string
}
