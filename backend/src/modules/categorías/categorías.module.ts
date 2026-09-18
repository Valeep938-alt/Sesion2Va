import { Module } from '@nestjs/common';
import { CategoríasService } from './categorías.service';
import { CategoríasController } from './categorías.controller';

@Module({
  controllers: [CategoríasController],
  providers: [CategoríasService],
})
export class CategoríasModule {}
