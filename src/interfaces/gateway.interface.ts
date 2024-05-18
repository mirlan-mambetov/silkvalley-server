import { UserRoles } from '@prisma/client'
import { IBase } from './Base.interface'

export interface IUserT {
  email: string
}
export interface IOnlineUsers extends IBase {
  id: number
  createdAt: Date
  updatedAt: Date
  users: {
    id: number
    createdAt: Date
    updatedAt: Date
    name: string
    email: string
    phoneNumber: string
    role: UserRoles[]
    isOnline: boolean
  }[]
}
