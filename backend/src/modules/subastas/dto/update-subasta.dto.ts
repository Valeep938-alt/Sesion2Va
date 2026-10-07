import { PartialType } from '@nestjs/mapped-types';
import { CreateSubastaDto } from './create-subasta.dto';

export class UpdateSubastaDto extends PartialType(CreateSubastaDto) {}

