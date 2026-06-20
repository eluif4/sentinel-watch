import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelemetryService } from './telemetry.service';
import { TelemetryController } from './telemetry.controller';
import { TelemetryEntity } from '../entities/telemetry.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        TypeOrmModule.forFeature([TelemetryEntity]),
        ClientsModule.register([
            {
                name: "TELEMETRY_SERVICE",
                transport: Transport.RMQ,
                options: {
                    urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
                    queue: process.env.RABBITMQ_TELEMETRY_ALERT_QUEUE,
                    queueOptions: {
                        durable: true,
                    },
                    noAck: true,
                }
            }
        ]),
    ],
    providers: [TelemetryService],
    controllers: [TelemetryController],
})

export class TelemetryModule { }
