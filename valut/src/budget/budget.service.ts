import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { mapBudgetInputToVault } from './budget.mapper';
import { CreateBudgetDto } from './DTOs/create-budget.dto';

@Injectable()
export class BudgetService {
  private readonly clientId: string | undefined;
  private readonly baseUrl: string | undefined;
  constructor(private readonly configService: ConfigService) {
    this.baseUrl = `${this.configService.get<string>('VAULT_BASE_URL')}/vobjects/em_budget__v`;
    this.clientId = this.configService.get<string>('VAULT_CLIENT_ID');
  }

  private getHeaders(authorization?: string) {
    return {
      Authorization: authorization || '',
      Accept: '*/*',
      'X-VaultAPI-ClientID': this.clientId,
    };
  }

  async create(
    createBudgetDto: CreateBudgetDto,
    authorization: string | undefined,
  ) {
    console.log(
      '🚀 ~ BudgetService ~ create ~ createBudgetDto:',
      createBudgetDto,
    );
    try {
      const response = await axios.post(
        `${this.baseUrl}?idParam=legacy_crm_id__v`,
        mapBudgetInputToVault(createBudgetDto),
        {
          headers: this.getHeaders(authorization),
        },
      );
      console.log(
        '🚀 ~ BudgetService ~ create ~ response.data:',
        response.data,
      );
      return response.data;
    } catch (error: any) {
      console.error('🚀 ~ BudgetService ~ create error:', error.message);
      throw error;
    }
  }
}
