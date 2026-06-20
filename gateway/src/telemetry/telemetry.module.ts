import { Module } from '@nestjs/common';
import { TelemetryController } from './telemetry.controller';
import { TelemetryService } from './telemetry.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: "TELEMETRY_SERVICE",
                transport: Transport.RMQ,
                options: {
                    urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
                    queue: process.env.RABBITMQ_TELEMETRY_QUEUE,
                    queueOptions: {
                        durable: true,
                    },
                    noAck: true,
                }
            }
        ]),
    ],
    controllers: [TelemetryController],
    providers: [TelemetryService]
})
export class TelemetryModule { }
