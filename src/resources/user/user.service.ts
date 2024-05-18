import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  forwardRef,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import * as argon from 'argon2'
import { PrismaService } from 'src/prisma.service'
import { AuthService } from '../auth/auth.service'
import { CreateUserDTO } from './data-transfer/create.user.dto'
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
  async save(dto: CreateUserDTO) {
    try {
      const hashedPassword = await this.hashedPassword(dto.password)
      await this.prismaService.user.create({
        data: {
          ...dto,
          password: hashedPassword,
        },
      })
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
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
  async updateUser(userId: number, dto: UpdateUserDTO) {
    let hashedPassword = dto?.password
      ? await this.hashedPassword(dto.password)
      : undefined

    let updatedData = {
      ...dto,
      email: dto?.email ? dto.email.trim().trimEnd() : undefined,
      name: dto?.name ? dto.name.trim().trimEnd() : undefined,
      password: hashedPassword,
      role: dto.role,
    }

    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: updatedData,
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
    if (user) return user

    return await this.prismaService.administration.findUnique({ where: { id } })
  }

  /**
   *
   * @param unique Number or String
   * @returns User
   */
  async findOneByEmail(email: string, selectObject?: Prisma.UserSelect) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email },
        select: {
          ...this.returnUserFields(),
          ...selectObject,
        },
      })

      if (!user) throw new BadRequestException('Пользователеь не найден')
      return user
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  /**
   *
   * @param email
   * @returns User profile
   */
  async getUserProfile(email: string) {
    return await this.findOneByEmail(email)
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

  private returnUserFields(): Prisma.UserSelect {
    return {
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
          address: true,
        },
      },
    }
  }
}
