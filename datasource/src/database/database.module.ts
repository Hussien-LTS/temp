import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attachment } from 'src/entities/attachment.entity';
import { BudgetTransaction } from 'src/entities/budget-salesforce-transaction.entity';
import { Budget } from 'src/entities/budget.entity';
import { Collaborator } from 'src/entities/collaborator.entity';
import { Contract } from 'src/entities/contract.entity';
import { Estimate } from 'src/entities/estimate.entity';
import { Event } from 'src/entities/event.entity';
import { EventProductTopic } from 'src/entities/event_product_topic.entity';
import { EventBudget } from 'src/entities/event_pudget.entity';
import { Expense } from 'src/entities/expense.entity';
import { HCPEligibility } from 'src/entities/hcp_eligibility.entity';
import { IntermediateUpdateQueue } from 'src/entities/intermediate_update_queue.entity';
import { Location } from 'src/entities/location .entity';
import { Participant } from 'src/entities/participant.entity';
import { SalesforceBudget } from 'src/entities/salesforce-budget.entity';
import { SalesforceVenue } from 'src/entities/salesforce_venue.entity';
import { SpeakerQualification } from 'src/entities/speaker_qualification.entity';
import { Territory } from 'src/entities/territory.entity';
import { TopicTransaction } from 'src/entities/topic-salesforce-transaction.entity';
import { TopicSalesforce } from 'src/entities/topic-salesforce.entity';
import { Topic } from 'src/entities/topic.entity';
import { Training } from 'src/entities/training.entity';
import { TransactionLog } from 'src/entities/transaction_log.entity';
import { User } from 'src/entities/user.entity';
import { UserTerritory } from 'src/entities/userterritory .entity';
import { VenueTransaction } from 'src/entities/venue-salesforce-transaction.entity';
import { Venue } from 'src/entities/venue.entity';
import { SalesforceAttendee } from 'src/entities/salesforce_attendee.entity';
import { SalesforceAttendeeAddress } from 'src/entities/salesforce_attendee_address.entity';
import { ConfigurableApi } from 'src/entities/configurable-API.entity';
import { ExpansionRule } from 'src/entities/expansion-rule.entity';
import { AttachmentIds } from 'src/entities/attachmentIds.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mssql',
        host: config.get<string>('DB_HOST'),
        port: parseInt(config.get<any>('DB_PORT')),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        schema: 'IQVIA',
        entities: [
          User,
          Attachment,
          Budget,
          Collaborator,
          Contract,
          Estimate,
          EventProductTopic,
          EventBudget,
          Event,
          Expense,
          HCPEligibility,
          IntermediateUpdateQueue,
          Location,
          Participant,
          SpeakerQualification,
          Territory,
          Topic,
          Training,
          TransactionLog,
          UserTerritory,
          Venue,
          BudgetTransaction,
          SalesforceBudget,
          TopicSalesforce,
          TopicTransaction,
          VenueTransaction,
          SalesforceVenue,
          SalesforceAttendee,
          SalesforceAttendeeAddress,
          ConfigurableApi,
          ExpansionRule,
          AttachmentIds,
        ],
        synchronize: true,
        extra: {
          trustServerCertificate: true,
          encrypt: false,
          enableArithAbort: true,
        },
        options: {
          encrypt: false, // For Azure SQL
          trustServerCertificate: true, // For self-signed certs
        },
      }),
    }),
  ],
})
// db UI -> https://webmssql.monsterasp.net/login
export class DatabaseModule {}
