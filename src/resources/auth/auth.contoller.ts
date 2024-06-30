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
import { Auth } from './decorators/auth.decorator'
import { CurrentUser } from './decorators/currentUser.decorator'

@Controller('auth')
export class AuthController {
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
      maxAge: 10 * 60 * 60 * 1000,
    })
    return res.status(HttpStatus.OK).json({
      message: 'Вход выполнен успешно',
      refreshToken: data.refreshToken,
    })
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @Auth()
  async refresh(
    @Body() token: { refreshToken: string },
    @CurrentUser('name') username: string,
  ) {
    const tokens = await this.authService.getNewTokens(token.refreshToken)
    return tokens
  }
}
