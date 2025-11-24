import { Injectable } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { Subscribe, Prisma } from '../generated/client'

@Injectable()
export class SubscribeService {
  constructor(private readonly prisma: PrismaService) {}

  async one(
    subscribeFindFirstArgs: Prisma.SubscribeFindFirstArgs
  ): Promise<Subscribe | null> {
    return this.prisma.subscribe.findFirst(subscribeFindFirstArgs)
  }

  async all(): Promise<Subscribe[]> {
    return this.prisma.subscribe.findMany()
  }

  async create(data: Prisma.SubscribeCreateInput): Promise<Subscribe> {
    return this.prisma.subscribe.create({
      data,
    })
  }

  async update(params: {
    where: Prisma.SubscribeWhereUniqueInput
    data: Prisma.SubscribeUpdateInput
  }): Promise<Subscribe> {
    const { data, where } = params
    return this.prisma.subscribe.update({
      data,
      where,
    })
  }
}
