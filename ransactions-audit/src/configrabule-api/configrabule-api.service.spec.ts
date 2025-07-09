import { Test, TestingModule } from '@nestjs/testing';
import { ConfigrubleApiService } from './configrabule-api.service';

describe('ConfigrubleApiService', () => {
  let service: ConfigrubleApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigrubleApiService],
    }).compile();

    service = module.get<ConfigrubleApiService>(ConfigrubleApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
