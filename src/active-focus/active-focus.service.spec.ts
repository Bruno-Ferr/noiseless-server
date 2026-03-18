import { Test, TestingModule } from '@nestjs/testing';
import { ActiveFocusService } from './active-focus.service';

describe('ActiveFocusService', () => {
  let service: ActiveFocusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActiveFocusService],
    }).compile();

    service = module.get<ActiveFocusService>(ActiveFocusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
