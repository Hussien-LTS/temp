import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './event/event.module';
import { TerritoryModule } from './territory/territory.module';
import { TopicModule } from './topic/topic.module';
import { VenueModule } from './venue/venue.module';
import { BudgetModule } from './budget/budget.module';
import { SpeakerAttendeeModule } from './speaker-attendee/speaker-attendee.module';
import { DocumentModule } from './document/document.module';
import { ConfigModule } from '@nestjs/config';
import { AttachmentModule } from './attachment/attachment.module';
import { UserModule } from './user/user.module';
import { UserTerritoryModule } from './user-territory/user-territory.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    EventModule,
    TerritoryModule,
    TopicModule,
    VenueModule,
    BudgetModule,
    SpeakerAttendeeModule,
    DocumentModule,
    AttachmentModule,
    UserModule,    
    UserTerritoryModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
