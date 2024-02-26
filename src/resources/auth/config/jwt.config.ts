import { ConfigService } from '@nestjs/config'
import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt'

const jwtModuleOption = (config: ConfigService): JwtModuleOptions => ({
  secret: config.get('JWT_SECRET_KEY'),
})
export const jwtConfigOptions = (): JwtModuleAsyncOptions => ({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => jwtModuleOption(config),
})
