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
import { AuthService } from './auth.service'
import { LoginDTO } from './data-transfer/login.dto'
import { RegisterDTO } from './data-transfer/register.dto'

@Controller('auth')
export class AuthController {
  expiresMilliseconds = 10 * 60 * 1000
  constructor(private readonly authService: AuthService) {}

  @Post('confirm')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  confirmEmail(@Body() body: { email: string }) {
    return this.authService.confirmEmail(body.email)
  }
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
    return res.status(HttpStatus.OK).json({
      message: 'Вход выполнен успешно',
      refreshToken: data.refreshToken,
      accessToken: data.accessToken,
    })
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() token: { refreshToken: string }, @Res() res: Response) {
    const data = await this.authService.getNewTokens(token.refreshToken)
    return res.json({
      refreshToken: data.refreshToken,
      accessToken: data.accessToken,
    })
  }
}
