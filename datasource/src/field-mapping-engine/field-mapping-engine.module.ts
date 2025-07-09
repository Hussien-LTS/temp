/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { FieldMappingEngineController } from './field-mapping-engine.controller';
import { FieldMappingEngineService } from './field-mapping-engine.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpansionRule } from 'src/entities/expansion-rule.entity';
import { ExpansionRuleModule } from 'src/expansion-rule/expansion-rule.module';

@Module({
  imports: [ExpansionRuleModule],  
  controllers: [FieldMappingEngineController],
  providers: [FieldMappingEngineService],
  exports: [FieldMappingEngineService],
})
export class FieldMappingEngineModule {}
