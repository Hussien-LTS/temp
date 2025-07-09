import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { RabbitMQService } from '../shared/rabbitmq/rabbitmq.service';
import { mapUserData } from './user.mapper';
import { mapToTransactionLog } from '../shared/mappers/transaction-log.mapper';

@Injectable()
export class UserService {
  private readonly clientId: any;
  private readonly baseUrl: any;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private rmqService: RabbitMQService,
  ) {
    this.baseUrl = this.configService.get<string>('VAULT_BASE_URL');
    this.clientId = this.configService.get<string>('VAULT_CLIENT_ID');
  }

  async getUserInfo(userIdArr, sessionId) {
    console.log('🚀 ~ UserService ~ getUserInfo ~ userIdArr:', userIdArr);
    try {
      const headers = {
        Authorization: sessionId,
        Accept: 'application/json',
        'X-VaultAPI-ClientID': this.clientId,
      };

      const userPromis = userIdArr.userid.map(async (id) => {
        return await axios.get(`${this.baseUrl}/vobjects/user__sys/${id}`, {
          headers,
        });
      });

      const usersResponse = await Promise.all(userPromis);
      const usersData = usersResponse.map((res) => mapUserData(res.data));

      await this.rmqService.emit(
        'vault-user-created',
        usersResponse.map((res) => res.data),
      );
      console.log(
        '🚀 ~ UserService ~ getUserInfo ~ usersResponse[0].data.data:',
        usersResponse[0].data,
      );

      let result;
      await Promise.race([
        (result = await this.rmqService.send(
          'user-transaction-log',
          mapToTransactionLog(usersResponse[0].data, 'User', 'Outbound'),
        )),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timed out')), 2000),
        ),
      ]);

      console.log("🚀 ~ UserService ~ getUserInfo ~ result.data.Id :", result.data.Id )
      return { userDataList: usersData, transactionId: result.data.Id };
    } catch (error) {
      console.log('🚀 ~ UserService ~ getUserInfo ~ error:', error);
      throw new BadRequestException('invalid body');
    }
  }
}
