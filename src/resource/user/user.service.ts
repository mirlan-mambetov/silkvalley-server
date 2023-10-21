import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import { IUser } from 'src/interfaces/user.interface'
import { PrismaService } from 'src/prisma.service'
import { ProductsService } from '../products/products.service'
import { RETURN_USER_OBJECT } from './constants/return.user.object'

@Injectable()
export class UserService {
  constructor(
    private readonly Prisma: PrismaService,
    private readonly productsService: ProductsService,
  ) {}

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
      select: RETURN_USER_OBJECT,
    })
    if (!user) throw new BadRequestException(HttpStatus.FORBIDDEN)
    return user
  }

  /**
   *
   * @param email
   * @returns User
   */
  async findUserByEmail(email: string, selectedObject?: Prisma.UserSelect) {
    const user = await this.Prisma.user.findUnique({
      where: { email },
      select: {
        ...RETURN_USER_OBJECT,
        ...selectedObject,
      },
    })
    if (!user) throw new BadRequestException('Пользователь не найден')
    return user
  }

  /**
   *
   * @param id
   * @returns User by ID
   */
  async findUserById(id: number) {
    try {
      const user = await this.Prisma.user.findUnique({
        where: { id },
        select: {
          ...RETURN_USER_OBJECT,
        },
      })
      if (!user) throw new BadRequestException('Пользователь не найден')
      return user
    } catch (err) {
      throw new BadRequestException(err)
    }
  }

  /**
   *
   * @param email
   * @returns BOOLEAN
   * @description Check  user by Email
   */
  async checkExistUserByEmail(email: string) {
    const user = await this.Prisma.user.findUnique({ where: { email } })
    if (!user) return false
    else return true
  }

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
        avatar: user.avatar,
      },
    })
    return userSave
  }

  async addToFavorite(productId: number, userId: number) {
    try {
      const product = await this.productsService.getProducById(
        Number(productId),
      )
      const user = await this.findUserById(userId)

      const isExist = user.featured.some((item) => item.id === product.id)
      await this.Prisma.user.update({
        where: { id: +userId },
        data: {
          featured: {
            [isExist ? 'disconnect' : 'connect']: {
              id: +productId,
            },
          },
        },
      })
      return {
        message: !isExist ? 'Добавлено в избранные' : 'Удалено из избранных',
      }
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
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
