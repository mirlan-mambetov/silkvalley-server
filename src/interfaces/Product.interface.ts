import { IBase } from './Base.interface'
import { ICategory } from './Category.interface'

export interface IProduct extends IBase {
  title: string
  description: string
  slug: string
  images: string[]
  poster: string
  price: number
  rating?: number
  discount?: number
  totalReviews?: number
  video?: string
  brand?: string
  attributes?: IProductAttributes
  category?: ICategory
}

export interface IProductAttributes extends IBase {
  colors?: []
  sizes?: []
  ram?: number
  storageMemory?: number
  weight?: number
  mainCamera?: number
  frontCamera?: number
  sheetQuantity?: number
  author?: number
  yearOfPublication?: number
  publishingHouse?: number
}
