import '../src/env';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';

describe('Postgres DB connection (e2e)', () => {
    let moduleFixture: TestingModule;
    let dataSource: DataSource;

    beforeAll(async () => {
        moduleFixture = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        dataSource = moduleFixture.get(DataSource);
    });

    afterAll(async () => {
        if (dataSource?.isInitialized) {
            await dataSource.destroy();
        }
    });

    it('should connect to the database', () => {
        expect(dataSource.isInitialized).toBe(true);
    });

    it('should respond to a simple query', async () => {
        const result = await dataSource.query('SELECT 1 AS ok');
        expect(result[0].ok).toBe(1);
    });

    it('should have the telemetry table', async () => {
        const tables = await dataSource.query(`
            SELECT tablename
            FROM pg_tables
            WHERE schemaname = 'public' AND tablename = 'telemetry'
        `);

        expect(tables).toHaveLength(1);
    });
});

import { ClientProxy } from '@nestjs/microservices';

describe('RabbitMQ connection (e2e)', () => {
    let moduleFixture: TestingModule;
    let client: ClientProxy;

    beforeAll(async () => {
        moduleFixture = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        client = moduleFixture.get<ClientProxy>('TELEMETRY_SERVICE');
        await client.connect();
    });

    afterAll(async () => {
        await client.close();
    });

    it('should connect to RabbitMQ', () => {
        expect(client).toBeDefined();
    });
});