import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { Response } from 'express'
import { AuthEnumName } from 'src/enums/auth.enum'
import { AuthService } from './auth.service'
import { LoginDTO } from './data-transfer/login.dto'
import { RegisterDTO } from './data-transfer/register.dto'

@Controller('auth')
export class AuthController {
  expiresMilliseconds = 10 * 60 * 1000
  constructor(private readonly authService: AuthService) {}

  /**
   *
   * @param dto
   * @returns
   */
  @Post('register')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  async register(@Body() dto: RegisterDTO) {
    return await this.authService.register(dto)
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  async login(@Body() dto: LoginDTO, @Res() res: Response) {
    const data = await this.authService.login(dto)

    res.cookie(AuthEnumName.ACCESS_TOKEN, data.accessToken, {
      httpOnly: true,
      path: '/',
      secure: true,
      sameSite: 'lax',
      maxAge: this.expiresMilliseconds,
    })
    return res.status(HttpStatus.OK).json({
      message: 'Вход выполнен успешно',
      refreshToken: data.refreshToken,
    })
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() token: { refreshToken: string }, @Res() res: Response) {
    const data = await this.authService.getNewTokens(token.refreshToken)

    res.cookie(AuthEnumName.ACCESS_TOKEN, data.accessToken, {
      httpOnly: true,
      path: '/',
      secure: true,
      sameSite: 'lax',
      maxAge: this.expiresMilliseconds,
    })

    return res.json({ refreshToken: data.refreshToken })
  }

  /**
   *
   * @param res
   * @returns
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logOut(@Res() res: Response) {
    res.clearCookie(AuthEnumName.ACCESS_TOKEN, {
      httpOnly: true,
      path: '/',
      secure: true,
      sameSite: 'lax',
    })
    return res.status(HttpStatus.OK).json({
      logout: true,
    })
  }
}
