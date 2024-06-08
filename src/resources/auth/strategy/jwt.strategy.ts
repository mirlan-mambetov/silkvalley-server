import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Users } from 'prisma/prisma-client'
import { UserService } from 'src/resources/user/user.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET_KEY'),
    })
  }

  async validate({ email }: Pick<Users, 'email'>) {
    return await this.userService.findOneByEmail(email)
  }
}
