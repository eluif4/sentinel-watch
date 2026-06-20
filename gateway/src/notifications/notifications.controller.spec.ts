import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsGateway } from './notifications.gateway';

describe('NotificationsController', () => {
    let controller: NotificationsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [NotificationsController],
            providers: [{ provide: NotificationsGateway, useValue: { sendAlert: jest.fn() } }],
        }).compile();

        controller = module.get<NotificationsController>(NotificationsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
