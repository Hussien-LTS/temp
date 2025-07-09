import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ExpansionRuleService } from './expansion-rule.service';
import { ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import {
  CreateExpansionRuleDto,
  UpdateExpansionRuleDto,
} from './DTOs/expanion-rule.dto';

@Controller('admin/expansion-rule')
export class ExpansionRuleController {
  constructor(private readonly expansionRuleService: ExpansionRuleService) {}

  @Get()
  @ApiQuery({
    name: 'targetApiId',
    type: Number,
    required: false,
    description: 'ID of the target API',
  })
  getAllExpansionRule(@Query() query: { targetApiId: string }) {
    const { targetApiId } = query;
    return this.expansionRuleService.getAllExpansionRule(targetApiId);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'ID of the expansion rule',
  })
  getExpansionRuleById(@Param('id') id: string) {
    return this.expansionRuleService.getExpansionRuleById(id);
  }

  @Put(':id')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  @ApiBody({ type: UpdateExpansionRuleDto, required: false })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'ID of the expansion rule',
  })
  updateExpansionRule(
    @Body() body: UpdateExpansionRuleDto,
    @Param('id') id: string,
  ) {
    return this.expansionRuleService.updateExpansionRule(body, id);
  }

  @Post()
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  @ApiBody({ type: CreateExpansionRuleDto, required: true })
  createExpansionRule(@Body() body: CreateExpansionRuleDto) {
    return this.expansionRuleService.createExpansionRule(body);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'ID of the expansion rule',
  })
  deleteExpansionRule(@Param('id') id: string) {
    console.log('🚀 ~ ExpansionRuleController ~ deleteExpansionRule ~ id:', id);
    return this.expansionRuleService.deleteExpansionRule(id);
  }
}
