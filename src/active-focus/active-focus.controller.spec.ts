import { Test, TestingModule } from '@nestjs/testing';
import { ActiveFocusController } from './active-focus.controller';
import { ActiveFocusService } from './active-focus.service';

describe('ActiveFocusController', () => {
  let controller: ActiveFocusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActiveFocusController],
      providers: [ActiveFocusService],
    }).compile();

    controller = module.get<ActiveFocusController>(ActiveFocusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
