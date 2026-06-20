import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateTelemetryDto } from './dto/telemetry-create.dto';
import { TelemetryService } from './telemetry.service';

@Controller('telemetry')
export class TelemetryController {
    constructor(private readonly telemetryService: TelemetryService) { }

    @EventPattern("api.log.received")
    async createTelemetry(@Payload() telemetry: CreateTelemetryDto) {
        return await this.telemetryService.createTelemetry(telemetry);
    }
}