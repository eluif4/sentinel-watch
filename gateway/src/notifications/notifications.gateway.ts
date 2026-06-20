import { EventPattern, Payload } from "@nestjs/microservices";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { NotificationsService } from "./notifications.service";
import { Server } from "socket.io";

@WebSocketGateway({ cors: true })
export class NotificationsGateway {
    @WebSocketServer() 
    server!: Server;
    
    sendAlert(alertData: any) {
        this.server.emit("security_alert", alertData);
    }
}