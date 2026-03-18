import { Test, TestingModule } from '@nestjs/testing';
import { ThoughtStreamController } from './thought-stream.controller';
import { ThoughtStreamService } from './thought-stream.service';

describe('ThoughtStreamController', () => {
  let controller: ThoughtStreamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThoughtStreamController],
      providers: [ThoughtStreamService],
    }).compile();

    controller = module.get<ThoughtStreamController>(ThoughtStreamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
