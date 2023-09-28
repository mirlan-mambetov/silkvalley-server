import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { IUser } from 'src/interfaces/user.interface'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class UserService {
  constructor(private readonly Prisma: PrismaService) {}

  /**
   * @param user
   * @param hashedPassword
   * @returns USER CREATED
   */
  async create(
    user: Pick<IUser, 'username' | 'email' | 'password' | 'avatar'>,
    hashedPassword: string,
  ) {
    const isExist = await this.checkExistUserByEmail(user.email)
    if (isExist)
      throw new BadRequestException(
        'Пользователь с таким E-mail уже существует',
      )
    const userSave = await this.Prisma.user.create({
      data: {
        username: user.username,
        email: user.email,
        password: hashedPassword,
        avatar: user.avatar
          ? user.avatar
          : 'https://ui-avatars.com/api/?background=random',
      },
    })
    return userSave
  }

  /**
   *
   * @param id
   * @description User profile
   */
  async getUserProfile(id: number) {
    const user = await this.Prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    if (!user) throw new BadRequestException(HttpStatus.FORBIDDEN)
    return user
  }

  /**
   *
   * @param email
   * @returns User
   */
  async findUserByEmail(email: string) {
    const user = await this.Prisma.user.findUnique({ where: { email } })
    if (!user) throw new BadRequestException('Пользователь не найден')
    return user
  }

  /**
   *
   * @param email
   * @returns BOOLEAN
   * @description Check  user by Email
   */
  async checkExistUserByEmail(email: string) {
    const user = await this.Prisma.user.findUnique({ where: { email } })
    if (!user) return !!user
  }

  /**
   * @param user
   * @returns USER FIELDS
   */
  returnUserFields(user: Partial<User>) {
    return {
      id: user.id,
      username: user.username,
    }
  }
}
