import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { EventModule } from './event/event.module';
import { BudgetModule } from './salesforce-budget/salesforce-budget.module';
import { SalesforceTopicModule } from './salesforce-topic/salesforce-topic.module';
import { VenueModule } from './salesforce-venue/salesforce-venue.module';
import { SalesforceAttendeeModule } from './salesforce-attendee/salesforce-attendee.module';
import { AttachmentModule } from './attachment/attachment.module';
import { VaultTerritoryModule } from './vault-territory/vault-territory.module';
import { TransactionLogModule } from './transaction-log/transaction-log.module';
import { ExpansionRuleModule } from './expansion-rule/expansion-rule.module';
import { ConfigurableApiModule } from './configurable-API/configurable-API.module';
import { SalesforceUserModule } from './salesforce-user/salesforce-user.module';
import { UserTerritoryModule } from './user-territory/user-territory.module';
import { SalesforceUserTerritoryModule } from './salesforce-user-territory/salesforce-user-territory.module';
import { FieldMappingEngineModule } from './field-mapping-engine/field-mapping-engine.module';
import { TopicModule } from './topic/topic.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    UsersModule,
    DatabaseModule,
    EventModule,
    BudgetModule,
    VenueModule,
    TopicModule,
    SalesforceTopicModule,
    SalesforceAttendeeModule,
    AttachmentModule,
    VaultTerritoryModule,
    TransactionLogModule,
    ExpansionRuleModule,
    ConfigurableApiModule,
    SalesforceUserModule,
    UserTerritoryModule,
    SalesforceUserTerritoryModule,
    FieldMappingEngineModule,
  ],
})
export class AppModule {}
