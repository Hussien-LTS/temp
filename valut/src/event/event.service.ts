import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { RabbitMQService } from 'src/shared/rabbitmq/rabbitmq.service';
import { UpdateEventDto } from './dtos/updateEvent.dto';
import * as qs from 'qs';
import { EventByIdVO } from './vos/event_response.vo';
@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);
  private readonly clientId: any;
  private readonly baseUrl: any;
  constructor(
    private readonly configService: ConfigService,
    private rmqService: RabbitMQService,
  ) {
    this.baseUrl = this.configService.get<string>('VAULT_BASE_URL');
    this.clientId = this.configService.get<string>('VAULT_CLIENT_ID');
  }
  async getEvents(authToken: string): Promise<any> {
    const clientId = this.clientId;
    const config = {
      method: 'get' as const,
      url: `${this.baseUrl}/vobjects/em_event__v`,
      headers: {
        Authorization: authToken,
        Accept: 'application/json',
        'X-VaultAPI-ClientID': this.clientId,
      },
    };
    if (!authToken || !clientId) {
      throw new HttpException(
        'Authorization token is missing or Client Id',
        401,
      );
    }
    try {
      this.logger.log('Fetching event');
      const res = await axios.request(config);
      if (!res) {
        this.logger.log('Event Not fetched!');
      }
      await this.rmqService.emit(`All_event_data`, res.data as EventByIdVO);
      return {
        data: res.data as EventByIdVO,
      };
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to fetch event',
        error.response?.status || 500,
        error.message ?? error,
      );
    }
  }

  async getEventById(authToken: string, eventId: string): Promise<any> {
    const clientId = this.clientId;
    const config = {
      method: 'get' as const,
      url: `${this.baseUrl}/vobjects/em_event__v/${eventId}`,
      headers: {
        Authorization: authToken,
        Accept: 'application/json',
        'X-VaultAPI-ClientID': clientId,
      },
    };
    if (!authToken) {
      throw new HttpException('Authorization token is missing', 401);
    }
    try {
      this.logger.log(`Fetching event : ${eventId}`);
      const res = await axios.request(config);
      if (res.data.responseStatus === 'SUCCESS') {
        this.logger.log(`Fetching event : ${eventId} successfully`);
      }
      const eventByIdVO: EventByIdVO = res.data as EventByIdVO;
      await this.rmqService.emit(`eventId_data`, eventByIdVO.data);
      return {
        data: eventByIdVO.data,
      };
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to fetch event',
        error.response?.status || 500,
        error.message ?? error,
      );
    }
  }

  async createEvent(authToken: string, body: any): Promise<any> {
    const clientId = this.clientId;
    const config = {
      method: 'post' as const,
      url: `${this.baseUrl}/vobjects/em_event__v`,
      data: body,
      headers: {
        Authorization: authToken,
        Accept: 'application/json',
        'X-VaultAPI-ClientID': clientId,
      },
    };
    if (!authToken) {
      throw new HttpException('Authorization token is missing', 401);
    }
    try {
      const res = await axios.request(config);
      if (res.data.responseStatus === 'SUCCESS') {
        this.logger.log(`Event Created successfully`);
      }
      return {
        msg: 'Event Created SUCCESS',
        data: res.data,
      };
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to fetch event',
        error.response?.status || 500,
        error.message ?? error,
      );
    }
  }

  async updateEvent(
    authToken: string,
    eventId: string,
    body: UpdateEventDto,
  ): Promise<any> {
    const clientId = this.clientId;
    const record: Record<string, string> = {
      [body.fieldName]: body.value,
    };
    const config = {
      method: 'put' as const,
      maxBodyLength: Infinity,
      url: `${this.baseUrl}/vobjects/em_event__v/${eventId}`,
      data: record,
      headers: {
        Authorization: authToken,
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-VaultAPI-ClientID': clientId,
      },
    };
    if (!authToken) {
      throw new HttpException(
        'Authorization token is missing',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const res = await axios.request(config);
      if (!(res.data.responseStatus === 'SUCCESS')) {
        this.logger.log(`Event not updated !`);
      }
      const eventDataUpdated = await this.getEventById(authToken, eventId);
      await this.rmqService.emit(`updated_eventId_data`, {
        data: res.data,
        eventDataUpdated,
      });
      return {
        msg: 'Event Updated SUCCESS and data sent to RMQ',
        data: res.data,
      };
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to fetch event',
        error.response?.status || 500,
        error.message ?? error,
      );
    }
  }

  async eventQyeryObject(
    eventId: string,
    authToken: string,
    vobjectName: string,
    name: string,
  ): Promise<any> {
    const query = `SELECT id, event__v , ${name} FROM ${vobjectName} WHERE event__v = '${eventId}'`;
    const data = qs.stringify({ q: query });
    const record: Record<string, string> = {
      ['q']: query,
    };
    const config = {
      method: 'post' as const,
      maxBodyLength: Infinity,
      url: 'https://sb-novo-migrator-na-2025-01-27v2.veevavault.com/api/v25.1/query',
      headers: {
        Authorization: authToken,
        Accept: 'application/json',
        'X-VaultAPI-DescribeQuery': 'true',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-VaultAPI-ClientID': this.clientId,
      },
      data: data,
    };
    const response = await axios.request(config);
    return response.data.data;
  }

  async queryVault(queryVar: string, authToken: string): Promise<any> {
    const query = queryVar;
    const data = qs.stringify({ q: query });

    const record: Record<string, string> = {
      ['q']: query,
    };
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
    console.log('queryVault ... ', response.data);
    return response.data;
  }

  async getStructuredEventPayload(eventId: string, authToken: string) {
    const [event, teamMembers, attendees, budgets] = await Promise.all([
      this.queryVault(
        `SELECT id, name__v,         estimated_attendance__v, start_date__v, end_date__v, start_time_local__v, end_time_local__v, time_zone__v,   status__v, description__v FROM em_event__v WHERE id = '${eventId}'`,
        authToken,
      ),
      this.queryVault(
        `SELECT id,   role__v,  modified_date__v FROM em_event_team_member__v WHERE event__v = '${eventId}'`,
        authToken,
      ),
      this.queryVault(
        `SELECT id FROM em_attendee__v WHERE event__v = '${eventId}'`,
        authToken,
      ),
      this.queryVault(
        `SELECT id, budget_name__v, external_id__v, modified_date__v FROM em_event_budget__v WHERE event__v = '${eventId}'`,
        authToken,
      ),
    ]);

    const e = event[0];
    await this.rmqService.emit(`event_data`, {
      VenueState: 'sfdgdfgh', // e.venue_state__v,
      VenuePostalCode: 'kdjd dskcf', // e.venue_postal_code__v,
      VenueName: 'JJSJS JHJN', //e.venue_name__v,
      VenueExternalId: null,
      VenueCity: 'AMmaman', //e.venue_city__v,
      VenueAddressLine2: null,
      VenueAddress: 'HHAHSJJ lkl', //e.venue_address__v,
      transactionId: 'KSKSKKSKKSK', //e.id,
      TopicID: 'AHM_TOP_0640',
      TeamMemberList: teamMembers.map((tm) => ({
        userId: tm.user__v,
        teamMemberId: tm.id,
        role: tm.role__v,
        ModifiedDateTime: tm.modified_date__v,
        isOwner: tm.is_owner__v ? 'TRUE' : null,
        ExternalId: null,
        expansionList: [],
        EventId: eventId,
      })),
      status: e.status__v,
      StartTimeLocal: e.start_time_local__v,
      StartDateTime: e.start_date__v + ' ' + e.start_time_local__v,
      StartDateLocal: e.start_date__v,
      ReconcilationStatus: 'false',
      PlannerApprovalNotRequired: 'false',
      ParentEventId: null,
      ownerId: e.owner__v,
      latestApprovalCommentid: null,
      latestApprovalComment: null,
      latestApprovalAction: null,
      IsVeevaSFDCAutoflow: 'false',
      ExternalId: null,
      ExpenseList: [],
      expansionList: [
        {
          outBoundField: 'Event_Number_vpro__c',
          actualValue: e.description__v,
        },
        { outBoundField: 'Start_Date_vod__c', actualValue: e.start_date__v },
        {
          outBoundField: 'Start_Time_Local_vod__c',
          actualValue: e.start_time_local__v,
        },
        { outBoundField: 'Time_Zone_vod__c', actualValue: e.time_zone__v },
      ],
      eventType: 'Speaker Program',
      EventTimeZoneLocal: e.time_zone__v,
      EventSubType: 'Home Office Webcast Satellite',
      EventSpeakerList: [], // you can fill this the same way
      EventOwnerTimeZone: e.time_zone__v,
      EventName: e.name__v,
      EventModifiedDateTime: e.modified_date__v,
      EventId: e.id,
      EventBudget: budgets.length
        ? {
            ModifiedDateTime: budgets[0].modified_date__v,
            IntBudId: null,
            ExternalId: budgets[0].external_id__v,
            expansionList: [],
            EventId: e.id,
            BudgetName: budgets[0].budget_name__v,
            BudExternalId: budgets[0].external_id__v,
          }
        : null,
      EstimateList: [],
      EstimatedAttendance: e.estimated_attendance__v,
      EndTimeLocal: e.end_time_local__v,
      EndDateTime: e.end_date__v + ' ' + e.end_time_local__v,
      EndDateLocal: e.end_date__v,
      Description: e.description__v,
      deletedAttendeeList: [],
      countryCode: 'US',
      CancellationRequestedDate: null,
      CancellationRequested: null,
      CancellationNotes: null,
      AutoApprovalNotRequired: 'false',
      attendeeList: attendees.map((a) => ({
        id: a.id,
        attendeeId: a.attendee__v,
        status: a.participation_status__v,
      })),
      AttachmentExists: 'false',
      AhmPlanningStatus: 'AHM Rejected',
    });
    return {
      VenueState: 'sfdgdfgh', // e.venue_state__v,
      VenuePostalCode: 'kdjd dskcf', // e.venue_postal_code__v,
      VenueName: 'JJSJS JHJN', //e.venue_name__v,
      VenueExternalId: null,
      VenueCity: 'AMmaman', //e.venue_city__v,
      VenueAddressLine2: null,
      VenueAddress: 'HHAHSJJ lkl', //e.venue_address__v,
      transactionId: 'KSKSKKSKKSK', //e.id,
      TopicID: 'AHM_TOP_0640',
      TeamMemberList: teamMembers.map((tm) => ({
        userId: tm.user__v,
        teamMemberId: tm.id,
        role: tm.role__v,
        ModifiedDateTime: tm.modified_date__v,
        isOwner: tm.is_owner__v ? 'TRUE' : null,
        ExternalId: null,
        expansionList: [],
        EventId: eventId,
      })),
      status: e.status__v,
      StartTimeLocal: e.start_time_local__v,
      StartDateTime: e.start_date__v + ' ' + e.start_time_local__v,
      StartDateLocal: e.start_date__v,
      ReconcilationStatus: 'false',
      PlannerApprovalNotRequired: 'false',
      ParentEventId: null,
      ownerId: e.owner__v,
      latestApprovalCommentid: null,
      latestApprovalComment: null,
      latestApprovalAction: null,
      IsVeevaSFDCAutoflow: 'false',
      ExternalId: null,
      ExpenseList: [],
      expansionList: [
        {
          outBoundField: 'Event_Number_vpro__c',
          actualValue: e.description__v,
        },
        { outBoundField: 'Start_Date_vod__c', actualValue: e.start_date__v },
        {
          outBoundField: 'Start_Time_Local_vod__c',
          actualValue: e.start_time_local__v,
        },
        { outBoundField: 'Time_Zone_vod__c', actualValue: e.time_zone__v },
      ],
      eventType: 'Speaker Program',
      EventTimeZoneLocal: e.time_zone__v,
      EventSubType: 'Home Office Webcast Satellite',
      EventSpeakerList: [], // you can fill this the same way
      EventOwnerTimeZone: e.time_zone__v,
      EventName: e.name__v,
      EventModifiedDateTime: e.modified_date__v,
      EventId: e.id,
      EventBudget: budgets.length
        ? {
            ModifiedDateTime: budgets[0].modified_date__v,
            IntBudId: null,
            ExternalId: budgets[0].external_id__v,
            expansionList: [],
            EventId: e.id,
            BudgetName: budgets[0].budget_name__v,
            BudExternalId: budgets[0].external_id__v,
          }
        : null,
      EstimateList: [],
      EstimatedAttendance: e.estimated_attendance__v,
      EndTimeLocal: e.end_time_local__v,
      EndDateTime: e.end_date__v + ' ' + e.end_time_local__v,
      EndDateLocal: e.end_date__v,
      Description: e.description__v,
      deletedAttendeeList: [],
      countryCode: 'US',
      CancellationRequestedDate: null,
      CancellationRequested: null,
      CancellationNotes: null,
      AutoApprovalNotRequired: 'false',
      attendeeList: attendees.map((a) => ({
        id: a.id,
        attendeeId: a.attendee__v,
        status: a.participation_status__v,
      })),
      AttachmentExists: 'false',
      AhmPlanningStatus: 'AHM Rejected',
    };
  }
}
