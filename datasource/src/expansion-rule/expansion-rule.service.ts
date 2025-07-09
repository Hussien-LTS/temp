import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExpansionRule } from 'src/entities/expansion-rule.entity';
import { Repository } from 'typeorm';
import {
  CreateExpansionRuleDto,
  UpdateExpansionRuleDto,
} from './DTOs/expanion-rule.dto';
import { ConfigurableApiService } from 'src/configurable-API/configurable-API.service';

@Injectable()
export class ExpansionRuleService {
  @InjectRepository(ExpansionRule)
  private expansionRuleRepository: Repository<ExpansionRule>;
  constructor(
    private readonly configurableApiService: ConfigurableApiService,
  ) {}

  async getExpansionRules(apiId?: number) {
    console.log(
      '🚀 ~ ExpansionRuleService ~ getExpansionRules ~ apiId:',
      apiId,
    );
    try {
      const results = await this.expansionRuleRepository.find({
        where: apiId ? { targetApiId: apiId } : {},
      });
      console.log(
        '🚀 ~ ExpansionRuleService ~ getExpansionRules ~ results:',
        results,
      );

      return results;
    } catch (error) {
      console.log(
        '🚀 ~ ExpansionRuleService ~ getExpansionRules ~ error:',
        error,
      );
      return new BadRequestException();
    }
  }

  async getExpansionRuleById(id: number) {
    console.log('🚀 ~ ExpansionRuleService ~ getExpansionRuleById ~ id:', id);
    try {
      const rule = await this.expansionRuleRepository.findOne({
        where: { id },
      });

      if (!rule) {
        throw new BadRequestException('Expansion rule not found');
      }

      console.log(
        '🚀 ~ ExpansionRuleService ~ getExpansionRuleById ~ rule:',
        rule,
      );
      return rule;
    } catch (error) {
      console.log(
        '🚀 ~ ExpansionRuleService ~ getExpansionRuleById ~ error:',
        error,
      );

      return new BadRequestException(
        error.message || 'Failed to retrieve expansion rule',
      );
    }
  }

  async createExpansionRule(body: CreateExpansionRuleDto) {
    console.log(
      '🚀 ~ ExpansionRuleService ~ createExpansionRule ~ body:',
      body,
    );
    try {
      const {
        ruleName,
        targetApiId,
        customLogic,
        objectName,
        centrisField,
        vaultField,
        dataType,
        allowNull,
        fieldValue,
      } = body;

      const targerApiById =
        await this.configurableApiService.getApiById(targetApiId);
      console.log(
        '🚀 ~ ExpansionRuleService ~ createExpansionRule ~ targerApi:',
        targerApiById,
      );

      if (!targerApiById) {
        throw new BadRequestException('invalid targerApiId');
      }
      const expansionRule = this.expansionRuleRepository.create({
        ruleName,
        targetApiId,
        customLogic,
        objectName,
        centrisField,
        vaultField,
        dataType,
        allowNull,
        fieldValue,
      });

      const savedRule = await this.expansionRuleRepository.save(expansionRule);

      console.log(
        '🚀 ~ ExpansionRuleService ~ createExpansionRule ~ savedRule:',
        savedRule,
      );
      return savedRule;
    } catch (error) {
      console.log(
        '🚀 ~ ExpansionRuleService ~ createExpansionRule ~ error:',
        error,
      );
      return new BadRequestException(error?.message);
    }
  }

  async updateExpansionRule(id: number, body: UpdateExpansionRuleDto) {
    console.log('📌 [updateExpansionRule] Incoming ID:', id);

    try {
      const rule = await this.expansionRuleRepository.findOne({
        where: { id },
      });

      if (!rule) {
        throw new BadRequestException('Expansion rule not found');
      }
      if (body) {
        const {
          ruleName,
          customLogic,
          objectName,
          centrisField,
          vaultField,
          dataType,
          allowNull,
          fieldValue,
        } = body;

        this.expansionRuleRepository.merge(rule, {
          ...(ruleName !== undefined && { ruleName }),
          ...(customLogic !== undefined && { customLogic }),
          ...(objectName !== undefined && { objectName }),
          ...(centrisField !== undefined && { centrisField }),
          ...(vaultField !== undefined && { vaultField }),
          ...(dataType !== undefined && { dataType }),
          ...(allowNull !== undefined && { allowNull }),
          ...(fieldValue !== undefined && { fieldValue }),
        });

        const savedRule = await this.expansionRuleRepository.save(rule);
        console.log(
          '🚀 ~ ExpansionRuleService ~ updateExpansionRule ~ savedRule:',
          savedRule,
        );
        return savedRule;
      }
      return rule;
    } catch (error) {
      console.log(
        '🚀 ~ ExpansionRuleService ~ updateExpansionRule ~ error:',
        error,
      );
      return new BadRequestException(
        error?.message || 'Unable to update expansion rule',
      );
    }
  }

  async deleteExpansionRule(id: number) {
    console.log('🚀 ~ ExpansionRuleService ~ deleteExpansionRule ~ id:', id);
    try {
      const rule = await this.getExpansionRuleById(id);

      if (!rule) {
        throw new BadRequestException('Expansion rule not found');
      }

      await this.expansionRuleRepository.delete(id);

      return { message: 'Expansion rule deleted successfully' };
    } catch (error) {
      console.log(
        '🚀 ~ ExpansionRuleService ~ deleteExpansionRule ~ error:',
        error,
      );

      throw new BadRequestException(
        error.message || 'Unable to delete expansion rule',
      );
    }
  }

  async getExpansionRulesByApiName(apiName: string) {
    const results = await this.expansionRuleRepository
      .createQueryBuilder('expansionRule')
      .leftJoinAndSelect('expansionRule.targetApi', 'targetApi')
      .where('targetApi.apiName = :apiName', { apiName })
      .getMany();

    return results;
  }
}
