import './env';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // API prefix and versioning
    app.setGlobalPrefix('api');
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
    });

    // API request security
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true
        })
    );

    // Server CORS
    console.log(`Allowing cors for ${process.env.FRONTEND_URL}`);
    app.enableCors({
        origin: [process.env.FRONTEND_URL], // Whitelist domains
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true, // Allow cookies/auth headers
        allowedHeaders: 'Content-Type, Accept',
    });

    // Connect RabbitMQ Microservice (consumes alert events from worker)
    console.log(`Connecting to RabbitMQ at ${process.env.RABBITMQ_URL}`);
    console.log(`Alert queue: ${process.env.RABBITMQ_TELEMETRY_ALERT_QUEUE}`);
    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.RMQ,
        options: {
            urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
            queue: process.env.RABBITMQ_TELEMETRY_ALERT_QUEUE,
            queueOptions: {
                durable: true,
            },
            noAck: true,
        },
    });

    // 3. Start the Microservice listener transport lines
    await app.startAllMicroservices();

    const port = process.env.PORT ?? 3000;
    console.log(`Running on port ${port}`);
    await app.listen(port);
}
bootstrap();
