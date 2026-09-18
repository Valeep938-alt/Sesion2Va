import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoríasService } from './categorías.service';
import { CreateCategoríaDto } from './dto/create-categoría.dto';
import { UpdateCategoríaDto } from './dto/update-categoría.dto';

@Controller('categorías')
export class CategoríasController {
  constructor(private readonly categoríasService: CategoríasService) {}

  @Post()
  create(@Body() createCategoríaDto: CreateCategoríaDto) {
    return this.categoríasService.create(createCategoríaDto);
  }

  @Get()
  findAll() {
    return this.categoríasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoríasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoríaDto: UpdateCategoríaDto) {
    return this.categoríasService.update(+id, updateCategoríaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoríasService.remove(+id);
  }
}
