import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoríaDto } from './create-categoría.dto';

export class UpdateCategoríaDto extends PartialType(CreateCategoríaDto) {}
