import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { VeevaEventWrapperDto } from './DTOs/add-Interaction.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CentrisEventService {
  private readonly logger = new Logger(CentrisEventService.name);
  private readonly baseUrl: any;
  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('SALESFORCE_URL');
  }
  async sendInteraction(
    auth: string,
    data: VeevaEventWrapperDto,
  ): Promise<any> {
    try {
      const baseUrl = `${this.baseUrl}/add/interaction`;
      const response = await axios.post(baseUrl, data, {
        headers: {
          Authorization: `Bearer ${auth}`,
          'Content-Type': 'application/json',
        },
      });
      if (response) {
        this.logger.log('Interaction sent successfully');
      }
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Salesforce API call failed',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async sendToSalesforce(payload: any): Promise<any> {
    try {
      const endpoint = `${this.baseUrl}/add/interaction`;
      const response = await axios.post(endpoint, payload, {
        headers: {
          client_id:
            '3MVG9dG9pUXcsrJANLhayvGIEIgf3Kq5FUDwaSx.rHj.Ji2D2.F7ouMmJTTJk8H5qxLM_uQsopuv6J5nnzADm',
          secret_id:
            '2C0FCF47039C5E6EB5281A05BAFA76A3A5A4DF6EA4EA05B92419E0975BD21525',
          Authorization:
            'Bearer 00DWJ000001v02n!AQEAQPzzGxh6cW6NdvycBdvW8f9VcMCHA7A5E8j0zqbCgE7czOt7szoYF3siWAZuH.vQtF2L4a9ANmINsx8ZgcSLMW6qQ_yk',
          'Content-Type': 'application/json',
          Cookie:
            'BrowserId=jXQLNBnbEfC05-ORxWC-ow; CookieConsentPolicy=0:1; LSKey-c$CookieConsentPolicy=0:1',
        },
      });
      return response.data;
    } catch (error) {
      return {
        status: 'error',
        message: error.response?.data || error.message,
      };
    }
  }

  private mapPayloadToSalesforceFormat(payload: any): any {
    const data = payload.data;
    const veevaEvent = {
      VenueState: data.state_province__v,
      VenuePostalCode: data.postal_code__v,
      VenueName: data.location__v,
      VenueExternalId: data.external_id__v,
      VenueCity: data.city__v,
      VenueAddressLine2: data.location_address_line_2__v,
      VenueAddress: data.location_address__v,
      transactionId: data.stub_sfdc_id__v,
      TopicID: data.topic__v,
      TeamMemberList: [
        // You'll need to map team members from your data if available
        // This is just a placeholder structure
        {
          userId: data.created_by__v?.toString(),
          teamMemberId: null, // Not in input data
          role: 'Organizer_vod',
          ModifiedDateTime: data.modified_date__v
            ?.replace('.000Z', '')
            .replace('T', ' '),
          isOwner: 'TRUE',
          ExternalId: null,
          expansionList: [],
          EventId: data.id,
        },
      ],
      status:
        data.em_event_status__v?.[0]?.replace('__v', '_vod') || 'Requested_vod',
      StartTimeLocal: data.start_time_local__v
        ? `${data.start_time_local__v}.000Z`
        : null,
      StartDateTime: data.start_time__v?.replace('.000Z', '').replace('T', ' '),
      StartDateLocal: data.start_date__v,
      ReconcilationStatus:
        data.attendee_reconciliation_complete__v?.toString() || 'false',
      PlannerApprovalNotRequired: 'false', // Not in input data
      ParentEventId: data.parent_event__v,
      OwnerID: data.ownerid__v?.toString(),
      latestApprovalCommentid: data.approval_comment__c,
      latestApprovalComment: data.approval_comment__c,
      latestApprovalAction: null, // Not in input data
      IsVeevaSFDCAutoflow: 'false', // Not in input data
      ExternalId: data.external_id__v,
      ExpenseList: [], // Would need to be populated from actual expenses
      expansionList: [
        {
          outBoundField: 'Catering_Notes__c',
          actualValue: data.catering_notes__c,
        },
        {
          outBoundField: 'Catering_Provider__c',
          actualValue: data.catering_provider__c,
        },
        {
          outBoundField: 'End_Date_vod__c',
          actualValue: data.end_date__v,
        },
        {
          outBoundField: 'End_Time_vod__c',
          actualValue: data.end_time__v?.replace('.000Z', '').replace('T', ' '),
        },
        {
          outBoundField: 'End_Time_Local_vod__c',
          actualValue: data.end_time_local__v,
        },
        {
          outBoundField: 'AV_Descriptions__c',
          actualValue: data.av_descriptions__c,
        },
        {
          outBoundField: 'Event_Number_vpro__c',
          actualValue: data.event_number_vpro__c,
        },
        {
          outBoundField: 'Location_Type_vpro__c',
          actualValue: data.location_type_vpro__c?.[0]?.replace('__c', ''),
        },
        {
          outBoundField: 'NNI_Speaker_Location__c',
          actualValue: data.nni_speaker_location__c,
        },
        {
          outBoundField: 'Start_Date_vod__c',
          actualValue: data.start_date__v,
        },
        {
          outBoundField: 'Start_Time_vod__c',
          actualValue: data.start_time__v
            ?.replace('.000Z', '')
            .replace('T', ' '),
        },
        {
          outBoundField: 'Start_Time_Local_vod__c',
          actualValue: data.start_time_local__v,
        },
        {
          outBoundField: 'Time_Zone_vod__c',
          actualValue: data.time_zone__v?.[0]
            ?.replace('__sys', '')
            .replace('america_', 'America/')
            .replace('new_york', 'New_York'),
        },
        {
          outBoundField: 'Location_Time_Zone_vpro__c',
          actualValue: data.location_time_zone_vpro__c,
        },
      ],
      eventType: data.program_type__v || 'Speaker Program',
      EventTimeZoneLocal: data.time_zone__v?.[0]
        ?.replace('__sys', '')
        .replace('america_', 'America/')
        .replace('new_york', 'New_York'),
      EventSubType: data.program_type__v || 'Speaker Program',
      EventSpeakerList: [], // Would need to be populated from actual speakers
      EventOwnerTimeZone: 'America/Los_Angeles', // Not in input data
      EventName: data.name__v,
      EventModifiedDateTime: data.modified_date__v
        ?.replace('.000Z', '')
        .replace('T', ' '),
      EventId: data.id,
      EventBudget: {
        ModifiedDateTime: null, // Not in input data
        IntBudId: null, // Not in input data
        ExternalId: null, // Not in input data
        expansionList: [],
        EventId: data.id,
        BudgetName: null, // Not in input data
        BudExternalId: null, // Not in input data
      },
      EstimateList: [], // Would need to be populated from actual estimates
      EstimatedAttendance: data.estimated_attendance__v?.toString(),
      EndTimeLocal: data.end_time_local__v
        ? `${data.end_time_local__v}.000Z`
        : null,
      EndDateTime: data.end_time__v?.replace('.000Z', '').replace('T', ' '),
      EndDateLocal: data.end_date__v,
      Description: data.description__v,
      deletedAttendeeList: [],
      countryCode: data.country__v?.replace('VENZ000000NN86P', 'US'), // Example mapping
      CancellationRequestedDate: null, // Not in input data
      CancellationRequested: null, // Not in input data
      CancellationNotes: data.cancellation_reason__v,
      AutoApprovalNotRequired: 'false', // Not in input data
      attendeeList: [], // Would need to be populated from actual attendees
      AttachmentExists: data.nni_eventattachmentcheck__c?.toString() || 'false',
      AhmPlanningStatus: data.ahm_planning_status__c,
    };

    return {
      veevaEvent: [veevaEvent],
    };
  }
}
