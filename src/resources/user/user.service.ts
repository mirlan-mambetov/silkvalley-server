import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import * as argon from 'argon2'
import { checkUserRole } from 'src/helpers/checkRole'
import { IUser } from 'src/interfaces/user.interface'
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
  async save(user: CreateUserDTO) {
    const hashedPassword = await this.hashedPassword(user.password)
    const findeduser = await this.findOneByEmail(user.email)
    if (findeduser) {
      const { admin } = checkUserRole(findeduser.role)
      if (!admin) {
        await this.prismaService.user.create({
          data: {
            ...user,
            password: hashedPassword,
            role: [user.role],
          },
        })
      }
    }
    return await this.prismaService.administration.create({
      data: {
        ...user,
        password: hashedPassword,
        role: [user.role],
      },
    })
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

    let updatedData = {
      ...dto,
      email: dto?.email ? dto.email.trim().trimEnd() : undefined,
      name: dto?.name ? dto.name.trim().trimEnd() : undefined,
      password: hashedPassword,
      role: dto.role,
    }

    const user = await this.findOneById(userId)
    const { admin } = checkUserRole(user.role)
    if (!admin) {
      await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: updatedData,
      })
    } else {
      await this.prismaService.administration.update({
        where: {
          id: userId,
        },
        data: updatedData,
      })
    }
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
    let user: IUser
    const findedUser = await this.prismaService.user.findUnique({
      where: { id },
    })
    if (findedUser) {
      const { admin } = checkUserRole(findedUser.role)
      if (!admin) {
        user = findedUser
      }
    }
    user = await this.prismaService.administration.findUnique({ where: { id } })
    return user
  }

  /**
   *
   * @param unique Number or String
   * @returns User
   */
  async findAmindById(id: number) {
    const user = await this.prismaService.administration.findUnique({
      where: { id },
    })
    if (!user)
      throw new BadRequestException(
        'Пользователь (Администратор) по такому ID не найден',
      )
    return user
  }
  /**
   *
   * @param unique Number or String
   * @returns User
   */
  async findOneByEmail(
    email: string,
    selectObject?: Prisma.UserSelect | Prisma.AdministrationSelect,
  ) {
    let user: IUser
    const findedUser = await this.prismaService.user.findUnique({
      where: { email },
      select: {
        ...this.returnUserFields(),
        ...selectObject,
      },
    })

    if (findedUser) {
      const { admin } = checkUserRole(findedUser.role)
      if (!admin) {
        user = findedUser
      }
    }
    user = await this.prismaService.administration.findUnique({
      where: { email },
      select: {
        ...this.returnAdminsField(),
        ...selectObject,
      },
    })
    return user
  }

  /**
   *
   * @param email
   * @returns User profile
   */
  async getUserProfile(email: string) {
    const user = await this.findOneByEmail(email)
    if (user) {
      const { admin } = checkUserRole(user.role)
      if (!admin) {
        return user
      }
    }
    return await this.findOneByEmail(email)
  }

  /**
   *
   * @param unique Number or String
   * @returns User
   */
  async findAllUsers() {
    const users = await this.prismaService.user.findMany()
    const admins = await this.prismaService.administration.findMany()
    return {
      users,
      admins,
    }
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
        },
      },
    }
  }
  private returnAdminsField(): Prisma.AdministrationSelect {
    return {
      id: true,
      name: true,
      email: true,
      avatar: true,
      phoneNumber: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    }
  }
}
