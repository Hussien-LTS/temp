/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
// field-mapping-engine.controller.ts

import { Body, Controller, Post } from '@nestjs/common';
import { FieldMappingEngineService } from './field-mapping-engine.service';
import { ApplyMappingDto } from './dtos/field-mapping-engine.interface';

@Controller('field-mapping')
export class FieldMappingEngineController {
  constructor(private readonly mappingService: FieldMappingEngineService) {}

  @Post('apply')
  async applyMapping(@Body() body: ApplyMappingDto) {
    return await this.mappingService.applyFieldMappings(
      body.targetApiId,
      body.apiDirection,
      body.payload,
    );
  }
}
