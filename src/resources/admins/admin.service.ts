import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { AdminDTO, AdminUpdateDTO } from './data-transfer/data.transfer'

@Injectable()
export class AdminService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   *
   * @param dto
   * @returns
   */
  async create(dto: AdminDTO) {
    const data = this.filteredData<AdminDTO>(dto)
    const user = await this.prismaService.administration.create({
      data: {
        ...data,
      },
    })
    return {
      message: `${user.name} Зарегистрирован`,
    }
  }

  /**
   *
   * @param userId
   * @param dto
   * @returns
   */
  async update(userId: number, dto: AdminUpdateDTO) {
    const data = this.filteredData<AdminUpdateDTO>(dto)
    await this.prismaService.administration.update({
      where: {
        id: userId,
      },
      data,
    })
    return {
      message: `Пользователь ${data.name} обновлен`,
    }
  }

  async findAll() {
    return await this.prismaService.administration.findMany({
      select: { ...this.returnAdminsField() },
    })
  }

  /**
   *
   * @param id
   * @returns
   */
  async findById(id: number) {
    return await this.prismaService.administration.findUnique({
      where: { id },
      select: { ...this.returnAdminsField() },
    })
  }

  /**
   *
   * @param email
   * @returns
   */
  async findByEmail(email: string) {
    return await this.prismaService.administration.findUnique({
      where: { email },
      select: { ...this.returnAdminsField() },
    })
  }

  /**
   *
   * @param dto
   * @returns <T>
   */
  private filteredData<T>(dto: AdminDTO): T {
    return {
      name: dto.name.trim().toString() || undefined,
      email: dto.email.trim().toString() || undefined,
      password: dto.password.toString() || undefined,
      phoneNumber: dto.phoneNumber.toString() || undefined,
      avatar: dto.avatar || undefined,
      role: dto.role || undefined,
    } as T
  }

  private returnAdminsField(): Prisma.AdministrationSelect {
    return {
      id: true,
      name: true,
      email: true,
      avatar: true,
      phoneNumber: true,
      createdAt: true,
      updatedAt: true,
      role: true,
    }
  }
}
