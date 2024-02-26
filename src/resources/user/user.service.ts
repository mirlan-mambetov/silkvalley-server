import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common'
import { User } from '@prisma/client'
import * as argon from 'argon2'
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
  async save(user: Partial<User>) {
    const hashedPassword = await this.hashedPassword(user.password)
    return await this.prismaService.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: hashedPassword,
        phoneNumber: user.phoneNumber,
        avatar: user.avatar,
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

    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        email: dto?.email ? dto.email.trim().trimStart().trimEnd() : undefined,
        name: dto?.name ? dto.name.trim().trimStart().trimEnd() : undefined,
        password: hashedPassword ? hashedPassword : undefined,
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
  async findOneByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
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
      return await this.findOneByEmail(email)
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
