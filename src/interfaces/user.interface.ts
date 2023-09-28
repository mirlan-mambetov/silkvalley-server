import { IBase } from './Base.interface'

export interface IUser extends IBase {
  username: string
  email: string
  password: string
  avatar?: string
}
