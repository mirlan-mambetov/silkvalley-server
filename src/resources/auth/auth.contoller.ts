import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { Request, Response } from 'express'
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
  async login(
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: LoginDTO,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(dto)
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
    })
    res.status(HttpStatus.OK).json({ accessToken, refreshToken })
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
