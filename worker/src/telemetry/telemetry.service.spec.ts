import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TelemetryService } from './telemetry.service';
import { TelemetryEntity } from '../entities/telemetry.entity';

describe('TelemetryService', () => {
    let service: TelemetryService;

    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
    };

    const mockRabbitClient = {
        emit: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TelemetryService,
                {
                    provide: getRepositoryToken(TelemetryEntity),
                    useValue: mockRepository,
                },
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

    describe('createTelemetry', () => {
        const dto = {
            path: '/testing',
            method: 'GET',
            ip: '127.0.0.1',
            statusCode: 200,
            responseTimeMs: 1,
        };

        it('should save telemetry and return the saved record', async () => {
            mockRepository.create.mockImplementation((data) => data);
            mockRepository.save.mockImplementation((entity) => ({ ...entity, id: 1 }));

            const result = await service.createTelemetry(dto);

            expect(mockRepository.create).toHaveBeenCalledWith({
                path: dto.path,
                method: dto.method,
                statusCode: dto.statusCode,
                responseTimeMs: dto.responseTimeMs,
                isAlert: false,
            });
            expect(mockRepository.save).toHaveBeenCalled();
            expect(result).toEqual({
                path: '/testing',
                method: 'GET',
                statusCode: 200,
                responseTimeMs: 1,
                isAlert: false,
                id: 1,
            });
            expect(mockRabbitClient.emit).not.toHaveBeenCalled();
        });

        it('should emit an alert when isAlert is true', async () => {
            const alertDto = { ...dto, statusCode: 500 };
            mockRepository.create.mockImplementation((data) => data);
            mockRepository.save.mockImplementation((entity) => ({ ...entity, id: 1 }));

            await service.createTelemetry(alertDto);

            expect(mockRabbitClient.emit).toHaveBeenCalledWith(
                'api.alert.triggered',
                expect.objectContaining({ isAlert: true }),
            );
        });
    });
});