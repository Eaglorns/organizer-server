import { Inject, Controller } from '@nestjs/common'
import { ProfileService } from '../db/profile.service'
import { WebsocketsGateway } from '../gateway/websockets.gateway'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'

@Controller('admin')
export class AdminController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly socket: WebsocketsGateway,
    private readonly profileService: ProfileService
  ) {}
}
