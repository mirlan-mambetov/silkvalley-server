import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'
import { Auth } from '../auth/decarators/auth.decarator'
import { CurrentUser } from './decarators/current.user'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @Auth()
  @HttpCode(HttpStatus.OK)
  async getUserProfile(@CurrentUser('id') userId: number) {
    return await this.userService.getUserProfile(userId)
  }
}
