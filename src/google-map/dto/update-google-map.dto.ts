import { PartialType } from '@nestjs/mapped-types';
import { CreateGoogleMapDto } from './create-google-map.dto';

export class UpdateGoogleMapDto extends PartialType(CreateGoogleMapDto) {}
