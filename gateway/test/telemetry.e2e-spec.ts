import { Test, TestingModule } from '@nestjs/testing';
import { TelemetryModule } from '../src/telemetry/telemetry.module';
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import request from 'supertest';

describe('Telemetry (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [TelemetryModule],
        })
            .overrideProvider('TELEMETRY_SERVICE')
            .useValue({ emit: jest.fn() })
            .compile();

        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix('api');
        app.enableVersioning({
            type: VersioningType.URI,
            defaultVersion: '1',
        });
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );
        await app.init();
    });

    it('/telemetry/create (POST)', () => {
        return request(app.getHttpServer())
            .post('/api/v1/telemetry/create')
            .send({
                path: '/telemetry/create',
                method: 'GET',
                ip: '127.0.0.1',
                statusCode: 200,
                responseTimeMs: 100,
            })
            .expect(201)
            .expect({
                message: 'Request sent'
            });
    });

    it ('/telemetry/create (POST) - Invalid body', () => {
        return request(app.getHttpServer())
            .post('/api/v1/telemetry/create')
            .send({
                // path: '/telemetry/create',
                method: 'GET',
                ip: '127.0.0.1',
                statusCode: 200,
                responseTimeMs: 100,
            })
            .expect(400);
    });

    afterEach(async () => {
        await app.close();
    });
});