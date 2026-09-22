import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subastas } from '../../entities/Subastas';
import { SubastaImagenes } from '../../entities/SubastaImagenes';
import { Categorias } from '../../entities/Categorias';
import { CommonModule } from '../../common/common.module';
import { SubastasController } from './subastas.controller';
import { SubastasService } from './subastas.service';
import { ImagenesService } from './imagenes.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Subastas,
      SubastaImagenes,
      Categorias,
    ]),
    CommonModule,
    NotificationsModule,
  ],
  controllers: [SubastasController],
  providers: [SubastasService, ImagenesService],
  exports: [SubastasService],
})
export class SubastasModule {}
