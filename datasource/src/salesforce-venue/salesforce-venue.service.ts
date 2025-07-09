import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VenueTransaction } from 'src/entities/venue-salesforce-transaction.entity';
import { SalesforceVenue } from 'src/entities/salesforce_venue.entity';

@Injectable()
export class VenueService {
  constructor(
    @InjectRepository(VenueTransaction)
    private venueTransactionRepository: Repository<VenueTransaction>,

    @InjectRepository(SalesforceVenue)
    private venueRepository: Repository<SalesforceVenue>,
  ) {}

  async handleVenueCreated(data: any): Promise<void> {
    try {
      const { TransactionId, VenueList } = data;
      const transaction = this.venueTransactionRepository.create({
        TransactionId: TransactionId,
      });

      await this.venueTransactionRepository.save(transaction);

      for (const venueData of VenueList) {
        const venue = this.venueRepository.create({
          VenueName: venueData.VenueName,
          Status: venueData.Status,
          State: venueData.State,
          PostalCode: venueData.PostalCode,
          ExternalId: venueData.ExternalId,
          City: venueData.City,
          AddressLine1: venueData.AddressLine1,
          AddressLine2: venueData.AddressLine2,
        });

        await this.venueRepository.save(venue);
      }
    } catch (error) {
      throw error;
    }
  }
}
