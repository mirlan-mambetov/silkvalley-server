import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { UserService } from '../user.service'

@Injectable()
export class OnlineUserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  async setOnline(userEmail: string) {
    try {
      const user = await this.getUser(userEmail)
      await this.prismaService.user.update({
        where: {
          id: user.id,
        },
        data: {
          isOnline: true,
        },
      })
    } catch (error) {
      console.log(error)
    }
  }

  async setOfflineStatus(userEmail: string) {
    const user = await this.getUser(userEmail)
    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        isOnline: false,
      },
    })
  }

  /**
   * @returns ONLINE USERS
   */
  async getOnlineUsers() {
    const users = await this.prismaService.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        phoneNumber: true,
        role: true,
        isOnline: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })
    return users
  }

  /**
   *
   * @param userEmail
   * @returns Booelan
   * @description Check user is online or offline
   */
  async getUser(userEmail: string) {
    if (userEmail) {
      // console.log(`CHECK USER ${userEmail}`)
      const userFind = await this.userService.findOneByEmail(userEmail)

      const user = await this.prismaService.user.findUnique({
        where: { id: userFind.id },
      })

      return user
    }
    return null
  }
}
