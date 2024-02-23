import { IBase } from './Base.interface'
import { IProduct } from './Product.interface'

export interface ICategory extends IBase {
  name: string
  childsCategories?: IChildCategory[]
  products?: IProduct[]
}
export interface IChildCategory extends IBase {
  name: string
  products?: IProduct[]
}
