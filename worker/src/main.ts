import './env';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
    console.log(`Connecting to RabbitMQ at ${process.env.RABBITMQ_URL}`);
    console.log(`Queue: ${process.env.RABBITMQ_TELEMETRY_QUEUE}`);
    
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            transport: Transport.RMQ,
            options: {
                urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
                queue: process.env.RABBITMQ_TELEMETRY_QUEUE,
                queueOptions: {
                    durable: true,
                },
                noAck: true,
            },
        }
    );

    await app.listen();
}
bootstrap();
