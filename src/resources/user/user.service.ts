import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import * as argon from 'argon2'
import { IUser } from 'src/interfaces/user.interface'
import { PrismaService } from 'src/prisma.service'
import { AuthService } from '../auth/auth.service'
import { UpdateUserDTO } from './data-transfer/update.user.dto'

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  /**
   *
   * @param user DTO USER
   * @returns
   */
  async save(user: Omit<IUser, 'createdAt' | 'updatedAt' | 'id'>) {
    const hashedPassword = await this.hashedPassword(user.password)
    let data = {
      ...user,
      password: hashedPassword,
    }
    if (user.role) {
      data = {
        // @ts-ignore
        role: [user.role],
      }
    }

    return await this.prismaService.user.create({ data })
  }

  /**
   *
   * @param USERID - User id
   * @param DTO - Data Transfer for updated
   * @returns success update message & tokens
   * @description Used by update user, and auth.service to save tokens. And updated user profile
   * @example
   * updateUser(userId: number, dto: UpdateUserDTO)  {
   *   const updatedUser = await userService.updateUser(userId, dto);
   *
   *   return {
   *     message: 'Пользователь успешно обновлен',
   *   };
   * }
   */
  async updateUser(userId: number, dto?: UpdateUserDTO | undefined | null) {
    let hashedPassword = dto?.password
      ? await this.hashedPassword(dto.password)
      : undefined

    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
        email: dto?.email ? dto.email.trim().trimEnd() : undefined,
        name: dto?.name ? dto.name.trim().trimEnd() : undefined,
        password: hashedPassword,
        // @ts-ignore
        role: [dto.role],
      },
    })
    return {
      message: 'Пользователь успешно обновлен',
    }
  }

  /**
   *
   * @param unique Number or String
   * @returns User
   */
  async findOneById(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    })
    if (!user)
      throw new BadRequestException('Пользователь по такому ID не найден')
    return user
  }

  /**
   *
   * @param unique Number or String
   * @returns User
   */
  async findOneByEmail(email: string, selectObject?: Prisma.UserSelect) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      select: {
        ...selectObject,
      },
    })
    if (!user)
      throw new BadRequestException('Пользователь по такому E-mail не найден')
    return user
  }

  /**
   *
   * @param email
   * @returns User profile
   */
  async getUserProfile(email: string) {
    try {
      return await this.findOneByEmail(email, {
        id: true,
        name: true,
        email: true,
        avatar: true,
        phoneNumber: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        orders: {
          include: {
            items: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      })
    } catch (error) {
      throw new UnauthorizedException(error)
    }
  }

  /**
   *
   * @param unique Number or String
   * @returns User
   */
  async findAllUsers() {
    return await this.prismaService.user.findMany()
  }

  /**
   *
   * @param id
   * @returns
   */
  async delete(id: number) {
    await this.prismaService.user.delete({ where: { id } })
    return { message: 'Пользователь удален' }
  }

  private async hashedPassword(password: string) {
    const hashedPassword = await argon.hash(password, { hashLength: 10 })
    return hashedPassword
  }
}
