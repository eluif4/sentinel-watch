import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationsGateway } from './notifications.gateway';

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationGateway: NotificationsGateway) {}

    @EventPattern("api.alert.triggered")
    async createTelemetry(@Payload() alertData: any) {
        console.log("Gateway intercepted emergency alert event. Bradcasting to UI...")
        this.notificationGateway.sendAlert(alertData);
    }
}
