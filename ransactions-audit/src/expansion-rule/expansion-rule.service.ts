import { BadRequestException, Injectable } from '@nestjs/common';
import { RabbitMQService } from 'src/shared/rabbitmq/rabbitmq.service';
import {
  CreateExpansionRuleDto,
  UpdateExpansionRuleDto,
} from './DTOs/expanion-rule.dto';

@Injectable()
export class ExpansionRuleService {
  constructor(private readonly rmqService: RabbitMQService) {}

  checkIdIsNumber(id: any) {
    return isNaN(id);
  }
  async getAllExpansionRule(targetApiId: string | null) {
    console.log(
      '🚀 ~ ExpansionRuleService ~ getAllExpansionRule ~ targetApiId:',
      targetApiId,
    );
    try {
      const expansionRule = await this.rmqService.send(
        'get_all_expansion_rule',
        { targetApiId },
      );
      if (expansionRule?.name === 'BadRequestException') {
        throw new BadRequestException('failed to get expansion rule ');
      }
      return expansionRule;
    } catch (error) {
      console.log(
        '🚀 ~ ExpansionRuleService ~ getAllExpansionRule ~ error:',
        error,
      );
      throw new BadRequestException(error?.message);
    }
  }

  async getExpansionRuleById(id: string) {
    console.log('🚀 ~ ExpansionRuleService ~ getExpansionRuleById ~ id:', id);
    try {
      if (this.checkIdIsNumber(id)) throw new BadRequestException('Invalid ID');
      const expansionRule = await this.rmqService.send(
        'get_expansion_rule_by_id',
        { id },
      );
      if (expansionRule?.name === 'BadRequestException') {
        throw new BadRequestException('failed to get expansion rule ');
      }
      console.log(
        '🚀 ~ ExpansionRuleService ~ getExpansionRuleById ~ expansionRule:',
        expansionRule,
      );
      return expansionRule;
    } catch (error) {
      console.log(
        '🚀 ~ ExpansionRuleService ~ getExpansionRuleById ~ error:',
        error,
      );
      throw new BadRequestException(error?.message);
    }
  }

  async updateExpansionRule(body: UpdateExpansionRuleDto, id: string) {
    try {
      if (this.checkIdIsNumber(id)) throw new BadRequestException('Invalid ID');
      const expansionRule = await this.rmqService.send(
        'update_expansion_rule',
        { id, body },
      );
      if (expansionRule?.name === 'BadRequestException') {
        throw new BadRequestException('failed to update expansion rule ');
      }
      return expansionRule;
    } catch (error) {
      console.log(
        '🚀 ~ ExpansionRuleService ~ updateExpansionRule ~ error:',
        error,
      );

      throw new BadRequestException(error?.message);
    }
  }

  async deleteExpansionRule(id: string) {
    console.log('🚀 ~ ExpansionRuleService ~ deleteExpansionRule ~ id:', id);
    try {
      if (this.checkIdIsNumber(id)) throw new BadRequestException('Invalid ID');
      const expansionRule = await this.rmqService.send(
        'delete_expansion_rule',
        { id },
      );
      if (expansionRule?.name === 'BadRequestException') {
        throw new BadRequestException('failed to delete expansion rule ');
      }
      return expansionRule;
    } catch (error) {
      console.log(
        '🚀 ~ ExpansionRuleService ~ deleteExpansionRule ~ error:',
        error,
      );

      throw new BadRequestException(error?.message);
    }
  }

  async createExpansionRule(body: CreateExpansionRuleDto) {
    try {
      const expansionRule = await this.rmqService.send(
        'create_expansion_rule',
        { body },
      );
      if (expansionRule?.name === 'BadRequestException') {
        throw new BadRequestException(
          expansionRule?.message || 'failed to create expansion rule ',
        );
      }
      return expansionRule;
    } catch (error) {
      console.log(
        '🚀 ~ ExpansionRuleService ~ createExpansionRule ~ error:',
        error,
      );

      throw new BadRequestException(error?.message);
    }
  }
}
