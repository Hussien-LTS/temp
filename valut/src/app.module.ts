import { Module } from '@nestjs/common';
import { VaultModule } from './vault/vault.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EventModule } from './event/event.module';
import { ConfigModule } from '@nestjs/config';
import { TransactionAttachModule } from './transaction-attach/transaction-attach.module';
import { SpeakersModule } from './speakers/speakers.module';
import { TerritoryModule } from './territory/territory.module';
import { AttendeesModule } from './attendees/attendees.module';
import { TopicModule } from './topic/topic.module';
import { BudgetModule } from './budget/budget.module';
import { UserModule } from './user/user.module';
import { AttachmentModule } from './attachment/attachment.module';
import { UserTerritoryModule } from './user-territory/user-territory.module';
import { VenueModule } from './venue/venue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    VaultModule,
    ScheduleModule.forRoot(),
    EventModule,
    TransactionAttachModule,
    SpeakersModule,
    TerritoryModule,
    AttendeesModule,
    TopicModule,
    BudgetModule,
    UserModule,
    AttachmentModule,
    UserTerritoryModule,
    VenueModule,
  ],
})
export class AppModule {}
