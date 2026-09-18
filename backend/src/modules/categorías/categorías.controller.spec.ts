import { Test, TestingModule } from '@nestjs/testing';
import { CategoríasController } from './categorías.controller';
import { CategoríasService } from './categorías.service';

describe('CategoríasController', () => {
  let controller: CategoríasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoríasController],
      providers: [CategoríasService],
    }).compile();

    controller = module.get<CategoríasController>(CategoríasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
