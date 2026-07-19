import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'inbox',
})
export class ConversationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ConversationsGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const authHeader = client.handshake.auth?.token || client.handshake.headers?.authorization;
      if (!authHeader) {
        client.disconnect();
        return;
      }

      const token = authHeader.replace('Bearer ', '');
      const secret = this.config.get('JWT_SECRET', 'default-secret-change-me');
      const payload = this.jwtService.verify(token, { secret });

      // Join room for this organization
      const orgRoom = `org_${payload.orgId}`;
      await client.join(orgRoom);
      client.data = { userId: payload.sub, organizationId: payload.orgId };

      this.logger.log(`Client ${client.id} connected & joined room ${orgRoom}`);
    } catch (err) {
      this.logger.warn(`WebSocket connection unauthorized: ${err.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client ${client.id} disconnected`);
  }

  emitToOrg(organizationId: string, event: string, payload: any) {
    const orgRoom = `org_${organizationId}`;
    this.server.to(orgRoom).emit(event, payload);
  }
}
