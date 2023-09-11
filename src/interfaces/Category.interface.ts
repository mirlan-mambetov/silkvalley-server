import { IBase } from './Base.interface'
import { IProduct } from './Product.interface'

export interface ICategory extends IBase {
  name: string
  slug: string

  product: IProduct[]
}
