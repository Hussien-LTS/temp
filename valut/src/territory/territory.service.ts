import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { RabbitMQService } from '../shared/rabbitmq/rabbitmq.service';
import {
  mapErrorToTransactionLog,
  mapToTransactionLog,
} from '../shared/mappers/transaction-log.mapper';
import { mapApiResponseToTerritory } from './territory.mapper';

@Injectable()
export class TerritoryService {
  private readonly logger = new Logger(TerritoryService.name);
  private readonly clientId: string | undefined;
  private readonly baseUrl: string | undefined;
  constructor(
    private readonly configService: ConfigService,
    private rmqService: RabbitMQService,
  ) {
    this.baseUrl = this.configService.get<string>('VAULT_BASE_URL');
    this.clientId = this.configService.get<string>('VAULT_CLIENT_ID');
  }
  async listAllTerritories(authToken: string): Promise<any> {
    const clientId = this.clientId;
    if (!authToken) {
      throw new HttpException(
        'Missing Authorization header',
        HttpStatus.BAD_REQUEST,
      );
    }
    const config = {
      method: 'get' as const,
      url: `${this.baseUrl}/vobjects/territory__v`,
      headers: {
        Authorization: authToken,
        Accept: 'application/json',
        'X-VaultAPI-ClientID': clientId,
      },
    };
    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error('Veeva error:', error?.response?.data);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error:
            error?.response?.data || 'Failed to fetch events from Veeva Vault',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async listTerritoryById(authToken: string, id: string): Promise<any> {
    console.log('🚀 ~ TerritoryService ~ listTerritoryById ~ id:', id);
    if (!authToken) {
      throw new HttpException(
        'Missing Authorization header',
        HttpStatus.BAD_REQUEST,
      );
    }
    const config = {
      method: 'get' as const,
      url: `${this.baseUrl}/vobjects/territory__v/${id}`,
      headers: {
        Authorization: authToken,
        Accept: 'application/json',
        'X-VaultAPI-ClientID': this.clientId,
      },
    };
    try {
      const response = await axios.request(config);
      const responseData = response.data;

      if (response?.data?.errors) {
        await this.rmqService.emit(
          'transaction-log',
          mapErrorToTransactionLog(response.data),
        );
      }
      await this.rmqService.emit(`vault-territory-created`, responseData.data);
      await this.rmqService.emit(
        'transaction-log',
        mapToTransactionLog(responseData, 'Territory', 'Outbound'),
      );

      console.log(
        '🚀 ~ TerritoryService ~ listTerritoryById ~ mapApiResponseToTerritory(response.data.data):',
        mapApiResponseToTerritory(response.data.data),
      );
      return mapApiResponseToTerritory(response.data.data);
    } catch (error) {
      console.error('Veeva error:', error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error:
            error?.response?.data || 'Failed to fetch events from Veeva Vault',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async updateTerritory(
    authToken: string,
    TerritoryId: string,
    body: Record<string, string>,
  ): Promise<any> {
    const clientId = this.clientId;
    const config = {
      method: 'put' as const,
      url: `${this.baseUrl}/vobjects/territory__v/${TerritoryId}`,
      data: body,
      headers: {
        Authorization: authToken,
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-VaultAPI-ClientID': clientId,
      },
    };
    if (!authToken) {
      throw new HttpException(
        'Authorization token is missing',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const res = await axios.request(config);
      if (!(res.data.responseStatus === 'SUCCESS')) {
        this.logger.log(`Territory not updated !`);
      }
      return {
        msg: 'Territory Updated SUCCESS',
        data: res.data,
      };
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to fetch Territory',
        error.response?.status || 500,
        error.message ?? error,
      );
    }
  }
}
