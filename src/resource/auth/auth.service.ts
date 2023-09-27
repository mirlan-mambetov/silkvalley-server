import { BadRequestException, Injectable } from '@nestjs/common'
import { hash } from 'argon2'
import { PrismaService } from 'src/prisma.service'
import { AuthRegisterDTO } from './dto/auth.dto'

@Injectable()
export class AuthService {
  constructor(private readonly Prisma: PrismaService) {}

  /**
   * @param dto
   * @description Register new User
   */
  async register(dto: AuthRegisterDTO) {
    const user = await this.Prisma.user.findUnique({
      where: { email: dto.email },
    })
    if (user)
      throw new BadRequestException(
        'Пользователь с таким E-mail уже зарегистрирован',
      )

    const hasnedPassword = await hash(dto.password)

    if (dto.avatar) {
      return await this.Prisma.user.create({
        data: {
          username: dto.username,
          email: dto.email,
          password: hasnedPassword,
          avatar: dto.avatar,
        },
      })
    } else {
      return await this.Prisma.user.create({
        data: {
          username: dto.username,
          email: dto.email,
          password: hasnedPassword,
        },
      })
    }
  }
}
