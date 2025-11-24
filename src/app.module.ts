import { Module } from '@nestjs/common'
import { DBServiceModule } from './db/db.module'
import { WebsocketsGatewayModule } from './gateway/websockets.module'
import { UtilsModule } from './util/utils.module'
import { ControllerModule } from './controller/controller.module'
import { WinstonModule } from 'nest-winston'
import * as winston from 'winston'
import { ScheduleModule } from '@nestjs/schedule'
import { TaskModule } from './task/task.module'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { format } from 'logform'
import { ConfigModule } from '@nestjs/config'

class TimestampFirst {
  enabled: boolean
  constructor(enabled: boolean = true) {
    this.enabled = enabled
  }
  transform(obj: any): any {
    if (this.enabled) {
      return {
        timestamp: obj.timestamp,
        ...obj,
      }
    }
    return obj
  }
}

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 1000,
      },
    ]),
    DBServiceModule,
    WebsocketsGatewayModule,
    ControllerModule,
    UtilsModule,
    ScheduleModule.forRoot(),
    TaskModule,
    ConfigModule.forRoot(),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.File({
          format: format.combine(
            format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
            new TimestampFirst(true),
            format.json({ deterministic: false })
          ),
          dirname: './logs/app/info/',
          filename: 'info.log',
          level: 'info',
          maxsize: 1048576,
          maxFiles: 10,
          zippedArchive: true,
        }),
        new winston.transports.File({
          format: format.combine(
            format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
            new TimestampFirst(true),
            format.json({ deterministic: false })
          ),
          dirname: './logs/app/error/',
          filename: 'error.log',
          level: 'error',
          maxsize: 1048576,
          maxFiles: 10,
          zippedArchive: true,
        }),
      ],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
