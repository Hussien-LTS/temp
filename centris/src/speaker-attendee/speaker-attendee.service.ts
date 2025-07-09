import { Injectable } from '@nestjs/common';
import { LitsAttendeeInfoDto } from './DTOs/attendee-info.dto';
import { RabbitMQService } from 'src/shared/rabbitmq/rabbitmq.service';
import * as qs from 'qs';
import axios from 'axios';

@Injectable()
export class SpeakerAttendeeService {
  constructor(private rmqService: RabbitMQService) {}

  async litsAttendeesInfo(
    authToken: string,
    payload: LitsAttendeeInfoDto,
  ): Promise<any> {
    const { ExternalId } = payload;
    const attendees: any[] = [];

    const whereCondition = ExternalId.map((id, index) => {
      if (index === 0) {
        return `external_id__v = '${id}'`;
      }
      return `or external_id__v = '${id}'`;
    });

    const attendeeList = await this.getAttendeeInfoFromVeeva(
      whereCondition.join(''),
      authToken,
    );

    const promises = [];

    if (attendeeList?.length) {
      for (const attendee of attendeeList) {
        const attendeeInfo = this.addAttendeeToRMQ(attendee);
        attendees.push(attendeeInfo);
      }
    }

    await Promise.all(promises);

    const result = ExternalId.map((externalId) => {
      const matchingAttendee = attendeeList.find(
        (attendee) => attendee.external_id__v === externalId,
      );

      if (matchingAttendee) {
        return {
          AttendeeDetail: {
            ExternalID: matchingAttendee?.external_id__v,
            Name: matchingAttendee?.attendee_name__v,
            FirstName: matchingAttendee?.first_name__v,
            LastName: matchingAttendee?.last_name__v,
            AddressList: [
              matchingAttendee?.address_line_1__v,
              matchingAttendee?.address_line_2__v,
            ],
          },
          ErrorMessage: '',
        };
      } else {
        return {
          AttendeeDetail: {
            ExternalID: externalId,
          },
          ErrorMessage: 'failure',
        };
      }
    });

    return { attendees: result };
  }

  async addAttendeeToRMQ(attendee: { [key: string]: unknown }): Promise<void> {
    await this.rmqService.emit(`salesforce-attendee-created`, { attendee });
  }

  async queryVault(queryVar: string, authToken: string): Promise<any> {
    const query = queryVar;
    const data = qs.stringify({ q: query });

    const config = {
      method: 'post' as const,
      maxBodyLength: Infinity,
      url: 'https://sb-novo-migrator-na-2025-01-27v2.veevavault.com/api/v25.1/query',
      headers: {
        Authorization: authToken,
        Accept: 'application/json',
        'X-VaultAPI-DescribeQuery': 'true',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-VaultAPI-ClientID':
          '3MVG9dG9pUXcsrJANLhayvGIEIgf3Kq5FUDwaSx.rHj.Ji2D2.F7ouMmJTTJk8H5qxLM_uQsopuv6J5nnzADm',
      },
      data: data,
    };

    const response = await axios.request(config);
    // console.log('queryVault ... ', response.data);
    return response.data;
  }

  async getAttendeeInfoFromVeeva(
    whereCondition: string,
    authToken: string,
  ): Promise<{ [key: string]: unknown }[]> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const attendeesData = await this.queryVault(
      `SELECT id, external_id__v, attendee_name__v, first_name__v, last_name__v, address_line_1__v, address_line_2__v FROM em_attendee__v  WHERE ${whereCondition}`,
      authToken,
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const result = (attendeesData?.data || []) as [];

    return result;
  }
}
