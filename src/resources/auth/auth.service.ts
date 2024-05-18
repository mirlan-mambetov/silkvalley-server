import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import * as argon from 'argon2'
import { IAuth } from 'src/interfaces/auth.interface'
import { PrismaService } from 'src/prisma.service'
import { v4 } from 'uuid'
import { UserService } from '../user/user.service'
import { LoginDTO } from './data-transfer/login.dto'
import { RegisterDTO } from './data-transfer/register.dto'

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async register(dto: RegisterDTO) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email: dto.email },
      })

      if (user) throw new BadRequestException('Такой E-mail уже используется')

      await this.userService.save(dto)

      return {
        message: 'Регистрация прошла успешно',
        success: true,
      }
    } catch (error) {
      throw new InternalServerErrorException({
        status: error.status,
        name: error.name,
        message:
          'Неизвестная ошибка сервера. Возможные причины: 1 - не правильныe значения в полях. 2 - ожидаемые типы не соответствуют требованиям!',
      })
    }
  }

  async login(dto: LoginDTO): Promise<IAuth> {
    const user = await this.userService.findOneByEmail(dto.email, {
      id: true,
      email: true,
      password: true,
      role: true,
    })
    if (!user) throw new BadRequestException('Пользователь не найден')

    // CHECK PASSWORD
    const comparePassword = await argon.verify(user.password, dto.password)
    if (!comparePassword) throw new UnauthorizedException('Пароли не совпадают')

    // GENERATE TOKENS
    const { accessToken, refreshToken } = await this.generateTokens(user)

    return {
      accessToken,
      refreshToken,
    }
  }

  private async generateTokens(user: Partial<User>) {
    const payload = { id: user.id, email: user.email, role: user.role }

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '10h',
    })
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    })
    return {
      accessToken,
      refreshToken,
    }
  }

  /**
   *
   * @returns
   * @deprecated This method is deprecated.
   */
  generateSessionId() {
    const sessionId = v4()
    return sessionId
  }

  async getNewTokens(token: string) {
    try {
      const result = await this.jwtService.verifyAsync(token)
      if (!result) throw new UnauthorizedException('Не валидный токен!')

      const user = await this.userService.findOneByEmail(result.email, {
        id: true,
        email: true,
        role: true,
      })
      const tokens = await this.generateTokens(user)

      return {
        ...tokens,
      }
    } catch (err) {
      throw new UnauthorizedException({ error: err })
    }
  }
}
