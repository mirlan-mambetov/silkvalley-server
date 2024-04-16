import { EnumProductSort } from 'src/enums/Filter.enum'

export class QueryDTO {
  childsCategoryId?: number
  secondCategoryId?: number
  mainCategoryId?: number
  selectedColor?: string
  selectedSize?: string
  sort?: EnumProductSort
  maxPrice?: number
  minPrice?: number
}
