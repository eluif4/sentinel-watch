import { Injectable, Inject } from '@nestjs/common';
import { CreateTelemetryDto } from './dto/telemetry-create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TelemetryEntity } from '../entities/telemetry.entity';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { isAlert } from './telemtry.utils';

@Injectable()
export class TelemetryService {
    constructor(
        @InjectRepository(TelemetryEntity) private telemetryRepository: Repository<TelemetryEntity>,
        @Inject("TELEMETRY_SERVICE") private rabbitClient: ClientProxy
    ) { }

    async createTelemetry(dto: CreateTelemetryDto): Promise<TelemetryEntity> {
        console.log(`New telemetry received from: ${dto.ip}`);

        const entity = this.telemetryRepository.create({
            path: dto.path,
            method: dto.method,
            statusCode: dto.statusCode,
            responseTimeMs: dto.responseTimeMs,
            isAlert: isAlert(dto.statusCode, dto.responseTimeMs),
        });

        const telemetryRecord = await this.telemetryRepository.save(entity);

        if (telemetryRecord.isAlert) {
            console.log('API alert');
            this.sendAlertEvent(telemetryRecord);
        }

        return telemetryRecord;
    }

    sendAlertEvent(telemetryRecord: TelemetryEntity) {
        this.rabbitClient.emit("api.alert.triggered", telemetryRecord);
    }
}