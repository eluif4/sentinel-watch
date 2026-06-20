import { Module } from '@nestjs/common';
import { TelemetryModule } from './telemetry/telemetry.module';
import { getDatabaseConfig } from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRoot(getDatabaseConfig()),
        TelemetryModule,
    ],
})
export class AppModule { }
