import { IsEnum, IsOptional, IsString } from 'class-validator'
import { EnumProductSort } from 'src/enums/Filter.enum'
import { PaginationDto } from 'src/resource/pagination/dto/pagination.dto'

export class FiltersDto extends PaginationDto {
  @IsOptional()
  @IsEnum(EnumProductSort)
  sort?: EnumProductSort

  @IsOptional()
  @IsString()
  searchTerm?: string

  @IsOptional()
  @IsString()
  rating?: number

  @IsOptional()
  @IsString()
  minPrice?: string

  @IsOptional()
  @IsString()
  maxPrice?: string

  @IsOptional()
  @IsString()
  categoryId?: string

  @IsOptional()
  @IsString()
  mainCategoryId?: string
}
