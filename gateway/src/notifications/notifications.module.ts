import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsGateway } from './notifications.gateway';

@Module({
    imports: [],
    providers: [NotificationsService, NotificationsGateway],
    controllers: [NotificationsController]
})
export class NotificationsModule { }
