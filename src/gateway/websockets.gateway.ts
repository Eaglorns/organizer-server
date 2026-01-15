import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets'
import { Socket, Server } from 'socket.io'
import { VicoMainService } from '../db/vicoMain.service'
import { VicoMain as VicoMainModel } from '../generated/client'
import { OptionService } from '../util/option.service'

@WebSocketGateway(null, { transports: ['websocket'] })
export class WebsocketsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly options: OptionService,
    private readonly vicoMainService: VicoMainService
  ) {}

  private readonly clients: Set<Socket> = new Set()

  @WebSocketServer() server: Server

  afterInit(server: Server) {
    console.log('Websocket Started')
  }

  handleDisconnect(client: Socket) {
    this.clients.delete(client)
  }

  async handleConnection(client: Socket) {
    this.clients.add(client)
    const vicoMainAll: VicoMainModel[] = await this.vicoMainService.all({
      where: {},
    })
    client.emit('load', {
      optionObject: this.options.optionObject,
      optionTypeVico: this.options.optionTypeVico,
      optionDepartament: this.options.optionDepartament,
    })
    client.emit('vicoAll', {
      vicos: vicoMainAll,
    })
  }
}
