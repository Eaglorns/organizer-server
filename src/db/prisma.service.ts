import { Injectable } from '@nestjs/common'
import { PrismaClient } from '../generated/client'
import { PrismaPg } from '@prisma/adapter-pg'

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    console.log(process.env.DATABASE_URL)
    const adapter = new PrismaPg({ url: process.env.DATABASE_URL })
    super({ adapter })
  }
}
