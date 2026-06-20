import { Inject, Injectable } from '@nestjs/common';
import { CreateTelemetryDto } from './dto/telemetry-create.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class TelemetryService {
    constructor(@Inject("TELEMETRY_SERVICE") private rabbitClient: ClientProxy) { }
    sendEvent(telemetry: CreateTelemetryDto) {
        this.rabbitClient.emit("api.log.received", telemetry);
    }
}