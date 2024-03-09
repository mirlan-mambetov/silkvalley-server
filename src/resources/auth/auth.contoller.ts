import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDTO } from './data-transfer/login.dto'
import { RegisterDTO } from './data-transfer/register.dto'
import { Auth } from './decorators/auth.decorator'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  @Auth('OWNER')
  register(@Body() dto: RegisterDTO) {
    return this.authService.register(dto)
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  async login(@Body() dto: LoginDTO) {
    return await this.authService.login(dto)
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() token: { refreshToken: string }) {
    const tokens = await this.authService.getNewTokens(token.refreshToken)
    return tokens
  }

  // private setTokenOrIdToCookie(tokenOrId: string, res: Response) {
  //   if (!tokenOrId) throw new UnauthorizedException()
  //   res.cookie('refreshToken', tokenOrId, {
  //     httpOnly: true,
  //     sameSite: 'strict',
  //   })
  // }
}
