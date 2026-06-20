import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTelemetryDto } from './dto/telemetry-create.dto';
import { TelemetryService } from './telemetry.service';

@Controller('telemetry')
export class TelemetryController {
    constructor(private readonly telemetryService: TelemetryService) { }

    @Post('/create')
    handleTelemetry(@Body() createTelemetryDto: CreateTelemetryDto) {
        this.telemetryService.sendEvent(createTelemetryDto);
        return { message: "Request sent" };
    }
}
