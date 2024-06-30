import { ConfigService } from '@nestjs/config'
import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt'

const jwtModuleOption = (configService: ConfigService): JwtModuleOptions => ({
  secret: configService.get<string>('JWT_SECRET_KEY'),
  global: true,
})
export const jwtConfigOptions = (): JwtModuleAsyncOptions => ({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => jwtModuleOption(config),
})
