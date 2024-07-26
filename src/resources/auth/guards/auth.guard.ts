import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { AuthEnumName } from 'src/enums/auth.enum'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(JwtService) private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)
    try {
      if (!token) {
        throw new UnauthorizedException()
      }
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
      })
      request['user'] = payload
    } catch (error) {
      throw new UnauthorizedException()
    }
    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization
    const cookies = request.cookies

    if (authHeader) {
      return authHeader.split('=')[1]
    }
    if (cookies && cookies[AuthEnumName.ACCESS_TOKEN]) {
      return cookies[AuthEnumName.ACCESS_TOKEN]
    }
    return undefined
  }
}
