import { Injectable } from '@nestjs/common';
import { CreateCategoríaDto } from './dto/create-categoría.dto';
import { UpdateCategoríaDto } from './dto/update-categoría.dto';

@Injectable()
export class CategoríasService {
  create(createCategoríaDto: CreateCategoríaDto) {
    return 'This action adds a new categoría';
  }

  findAll() {
    return `This action returns all categorías`;
  }

  findOne(id: number) {
    return `This action returns a #${id} categoría`;
  }

  update(id: number, updateCategoríaDto: UpdateCategoríaDto) {
    return `This action updates a #${id} categoría`;
  }

  remove(id: number) {
    return `This action removes a #${id} categoría`;
  }
}
