import { UserRoles } from '@prisma/client'
import { IBase } from './Base.interface'

export interface IUser extends IBase {
  name: string
  email: string
  password: string
  avatar?: string
  phoneNumber: string
  role?: UserRoles[]
}
