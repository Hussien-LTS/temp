import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendeeService } from './salesforce-attendee.service';
import { SalesforceAttendee } from 'src/entities/salesforce_attendee.entity';
import { SalesforceAttendeeAddress } from 'src/entities/salesforce_attendee_address.entity';
import { AttendeeController } from './salesforce-attendee.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([SalesforceAttendee, SalesforceAttendeeAddress]),
  ],
  providers: [AttendeeService],
  exports: [AttendeeService],
  controllers: [AttendeeController],
})
export class SalesforceAttendeeModule {}
