import { Test, TestingModule } from '@nestjs/testing';
import { TelemetryService } from './telemetry.service';

describe('TelemetryService', () => {
    let service: TelemetryService;

    const mockRabbitClient = {
        emit: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TelemetryService,
                {
                    provide: 'TELEMETRY_SERVICE',
                    useValue: mockRabbitClient,
                },
            ],
        }).compile();

        service = module.get<TelemetryService>(TelemetryService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
