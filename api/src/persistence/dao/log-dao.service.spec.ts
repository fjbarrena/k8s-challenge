import { Test, TestingModule } from '@nestjs/testing';
import { LogDAO } from './log-dao.service';

describe('LogDAO', () => {
  let service: LogDAO;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogDAO],
    }).compile();

    service = module.get<LogDAO>(LogDAO);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
