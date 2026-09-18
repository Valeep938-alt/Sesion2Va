import { Test, TestingModule } from '@nestjs/testing';
import { CategoríasService } from './categorías.service';

describe('CategoríasService', () => {
  let service: CategoríasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoríasService],
    }).compile();

    service = module.get<CategoríasService>(CategoríasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
