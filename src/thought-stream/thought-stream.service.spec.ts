import { Test, TestingModule } from '@nestjs/testing';
import { ThoughtStreamService } from './thought-stream.service';

describe('ThoughtStreamService', () => {
  let service: ThoughtStreamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ThoughtStreamService],
    }).compile();

    service = module.get<ThoughtStreamService>(ThoughtStreamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
