import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesforceAttendee } from 'src/entities/salesforce_attendee.entity';

@Injectable()
export class AttendeeService {
  constructor(
    @InjectRepository(SalesforceAttendee)
    private salesforceAttendeeRepository: Repository<SalesforceAttendee>,
  ) {}

  async createAttendee(data: Record<string, unknown>): Promise<void> {
    const { AddressList, ...otherData } = data?.attendee as Record<
      string,
      unknown
    >;

    const formattedAddress = (AddressList as [])
      ?.filter((address?: any) => address)
      ?.map((address?: string) => ({
        Address: address || undefined,
      }));

    const attendee = this.salesforceAttendeeRepository.create({
      ...otherData,
      Addresses: formattedAddress?.length ? formattedAddress : undefined,
    });

    await this.salesforceAttendeeRepository.save(attendee);
  }
}
