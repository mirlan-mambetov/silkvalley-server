import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/currentUser.decorator'
import { CreateUserDTO } from './data-transfer/create.user.dto'
import { UpdateUserDTO } from './data-transfer/update.user.dto'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userSerivce: UserService) {}

  /**
   *
   * @param user
   * @returns
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  create(@Body() user: CreateUserDTO) {
    return this.userSerivce.save(user)
  }

  /**
   *
   * @param id
   * @param dto
   * @returns
   */
  @Put(':id')
  @Auth()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  updateById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDTO,
  ) {
    return this.userSerivce.updateUser(id, dto)
  }

  /**
   *
   * @param dto
   * @param userId
   * @returns
   */
  @Put()
  @Auth()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  updateProfile(@Body() dto: UpdateUserDTO, @CurrentUser('id') userId: number) {
    return this.userSerivce.updateUser(userId, dto)
  }

  /**
   *
   * @returns Users
   */
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @Auth()
  findProfile(@CurrentUser('email') email: string) {
    return this.userSerivce.getUserProfile(email)
  }

  /**
   *
   * @param id
   * @returns User
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOneById(@Param('id', ParseIntPipe) id: number) {
    return this.userSerivce.findOneById(id)
  }

  /**
   *
   * @param email CurrentUser
   * @returns User
   */
  @Get('by-email/:email')
  @HttpCode(HttpStatus.OK)
  findOneByEmail(@Param('email') email: string) {
    return this.userSerivce.findOneByEmail(email)
  }

  /**
   *
   * @returns Users
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  findAllUsers() {
    return this.userSerivce.findAllUsers()
  }

  /**
   *
   * @param id
   * @returns Message
   */
  @Delete(':id')
  @Auth('OWNER')
  @HttpCode(HttpStatus.OK)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.userSerivce.delete(id)
  }
}
