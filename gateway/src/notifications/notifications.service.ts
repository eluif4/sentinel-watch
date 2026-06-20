import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';

@Injectable()
export class NotificationsService {
    @WebSocketServer() server!: Server;
    sendAlert(alertData: any) {
        this.server.emit("security_alert", alertData);
    }
}
