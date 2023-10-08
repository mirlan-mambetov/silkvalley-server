import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common'
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

  @Get('by-email/:email')
  @Auth()
  @HttpCode(HttpStatus.OK)
  async findUserByEmail(@Param('email') email: string) {
    return await this.userService.findUserByEmail(email)
  }

  @Get(':id')
  @Auth()
  @HttpCode(HttpStatus.OK)
  async findUserById(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findUserById(+id)
  }

  @Post('add-favorite')
  @Auth()
  @HttpCode(HttpStatus.OK)
  async addToFavorite(
    @Body() dto: { productId: number },
    @CurrentUser('id') userId: number,
  ) {
    return await this.userService.addToFavorite(dto.productId, userId)
  }
}
