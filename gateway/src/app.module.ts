import { Module } from '@nestjs/common';
import { TelemetryModule } from './telemetry/telemetry.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
    imports: [
        TelemetryModule,
        NotificationsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
