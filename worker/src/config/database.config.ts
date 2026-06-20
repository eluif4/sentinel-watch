import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TelemetryEntity } from '../entities/telemetry.entity';

export const getDatabaseConfig = (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [TelemetryEntity],
    synchronize: true,
});
