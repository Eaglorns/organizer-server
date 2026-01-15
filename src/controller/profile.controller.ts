import { Inject, Controller, Post, Req, Res, Ip } from '@nestjs/common'
import { FastifyRequest, FastifyReply } from 'fastify'
import { ProfileService } from '../db/profile.service'
import { Profile as ProfileModel } from '../generated/client'
import { DateTime } from 'luxon'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import { Throttle } from '@nestjs/throttler'

@Controller('vico')
export class VicoController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly profileService: ProfileService
  ) {}

  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @Post('one')
  async one(
    @Req() request: FastifyRequest,
    @Res() response: FastifyReply,
    @Ip() ip: string
  ) {
    const body = request.body as {
      login: string
      password: string
    }
    try {
      const profile = await this.profileService.one({
        where: {
          login: body.login,
        },
      })

      if (profile) {
        if (body.password == profile.password) {
          response.send({ success: true, ip: ip, role: profile.role })
        }
      } else {
        response.send({ success: false })
      }
    } catch (err) {
      console.log(err)
      this.logger.error({
        type: 'vico-one',
        ip: ip,
        login: body.login,
      })
      response.send({
        success: false,
        message: 'Непредвиденная ошибка на сервере',
      })
    }
  }
}
