import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { hash, verify } from 'argon2'
import { PrismaService } from 'src/prisma.service'
import { UserService } from '../user/user.service'
import { AuthLoginDTO, AuthRegisterDTO } from './dto/auth.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly Prisma: PrismaService,
    private readonly Jwt: JwtService,
    private readonly userService: UserService,
  ) {}

  /**
   * @param dto
   * @description Register new User
   */
  async register(dto: AuthRegisterDTO) {
    const hasnedPassword = await hash(dto.password)

    const user = await this.userService.create(dto, hasnedPassword)

    const tokens = await this.issueTokens(user.id)
    return {
      user: this.userService.returnUserFields(user),
      ...tokens,
    }
  }

  /**
   *
   * @param dto
   * @returns TOkens and User
   */
  async login(dto: AuthLoginDTO) {
    await this.userService.checkExistUserByEmail(dto.email)
    const user = await this.userService.findUserByEmail(dto.email)
    const checkPassword = await verify(user.password, dto.password)
    if (!checkPassword) throw new BadRequestException('Неправильный пароль')

    const tokens = await this.issueTokens(user.id)

    return {
      user: this.userService.returnUserFields(user),
      tokens,
    }
  }

  /**
   *
   * @param userId
   * @description Generate auth tokens
   * @returns AccessToken and RefreshToken
   */
  private async issueTokens(userId: number) {
    try {
      const data = { id: userId }

      const accessToken = this.Jwt.sign(data, {
        expiresIn: '1h',
      })

      const refreshToken = this.Jwt.sign(data, {
        expiresIn: '7d',
      })
      return {
        accessToken,
        refreshToken,
      }
    } catch (err) {
      throw new HttpException(
        'Неизвестная ошибка сервера, повторите попытку позже.',
        HttpStatus.UNAUTHORIZED,
      )
    }
  }
}
