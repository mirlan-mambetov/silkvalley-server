import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Users } from '@prisma/client'
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

  /**
   *
   * @param dto
   * @returns
   */
  async register(dto: RegisterDTO) {
    try {
      const user = await this.userService.findOneByEmail(dto.email)

      if (!user) {
        await this.userService.save(dto)
        return {
          message: 'Регистрация прошла успешно',
          success: true,
        }
      }
      return new BadRequestException('Такой E-mail уже используется')
    } catch (error) {
      throw new BadRequestException({
        status: error.status,
        name: error.name,
        message:
          'Неизвестная ошибка сервера. Возможные причины: 1 - не правильныe значения в полях. 2 - ожидаемые типы не соответствуют требованиям!',
      })
    }
  }

  /**
   *
   * @param dto
   * @returns
   */
  async login(dto: LoginDTO): Promise<IAuth> {
    try {
      const user = await this.userService.findOneByEmail(dto.email, {
        id: true,
        email: true,
        password: true,
        role: true,
      })
      if (!user) throw new BadRequestException('Пользователь не найден')

      // CHECK PASSWORD
      const comparePassword = await argon.verify(user.password, dto.password)
      if (!comparePassword) throw new BadRequestException('Пароли не совпадают')

      // GENERATE TOKENS
      const { accessToken, refreshToken } = await this.generateTokens(user)

      return {
        accessToken,
        refreshToken,
      }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  /**
   *
   * @param user
   * @returns
   */
  private async generateTokens(user: Partial<Users>) {
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

  /**
   *
   * @param token
   * @returns
   */
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
