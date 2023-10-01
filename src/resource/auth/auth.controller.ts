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
import { AuthLoginDTO, AuthRegisterDTO, TokenDTO } from './dto/auth.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async register(@Body() dto: AuthRegisterDTO) {
    return await this.authService.register(dto)
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: AuthLoginDTO) {
    return await this.authService.login(dto)
  }

  @Post('refresh')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async getNewUserTokens(@Body() token: TokenDTO) {
    return await this.authService.getNewUserToken(token.refreshToken)
  }
}
