import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { mapVenueInputToVault } from './venue.mapper';
import { CreateVenueDto } from './DTOs/create_update_venue.dto';

@Injectable()
export class VenueService {
  private readonly clientId: string | undefined;
  private readonly baseUrl: string | undefined;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = `${this.configService.get<string>('VAULT_BASE_URL')}/vobjects/em_venue__v`;
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
    createVenueDto: CreateVenueDto,
    authorization: string | undefined,
  ) {
    console.log('🚀 ~ VenueService ~ create ~ createVenueDto:', createVenueDto);

    try {
      const response = await axios.post(
        `${this.baseUrl}?idParam=legacy_crm_id__v`,
        mapVenueInputToVault(createVenueDto),
        {
          headers: this.getHeaders(authorization),
        },
      );

      console.log('🚀 ~ VenueService ~ create ~ response.data:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('🚀 ~ VenueService ~ create error:', error.message);
      throw error;
    }
  }
}
