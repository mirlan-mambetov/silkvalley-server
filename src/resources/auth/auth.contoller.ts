import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { Response } from 'express'
import { AuthService } from './auth.service'
import { LoginDTO } from './data-transfer/login.dto'
import { RegisterDTO } from './data-transfer/register.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  register(@Body() dto: RegisterDTO) {
    return this.authService.register(dto)
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  async login(@Body() dto: LoginDTO) {
    return await this.authService.login(dto)
  }

  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() token: { refreshToken: string }) {
    return this.authService.getNewTokens(token.refreshToken)
  }

  private setTokenOrIdToCookie(tokenOrId: string, res: Response) {
    if (!tokenOrId) throw new UnauthorizedException()
    res.cookie('refreshToken', tokenOrId, {
      httpOnly: true,
      sameSite: 'strict',
    })
  }
}
