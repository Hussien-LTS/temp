import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { EventService } from './event.service';
import {
  ApiSecurity,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBody,
  ApiConsumes,
  ApiHeader,
} from '@nestjs/swagger';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { QueryVeevaDto } from './dtos/queryVeeva.dto';
import { EventIdDto, UpdateEventDto } from './dtos/updateEvent.dto';

@ApiTags('vvevent')
@Controller('vvevent')
@ApiSecurity('sessionId')
export class EventController {
  private currentSession: string | null = null;
  constructor(private readonly eventService: EventService) {}

  @EventPattern('vault_auth_response')
  async handleAuthResponse(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('Auth from RMQ', data);
    const sessionId = data?.sessionId;
    if (!sessionId) {
      context.getChannelRef().nack(context.getMessage(), false, false);
      throw new Error('Session ID missing in payload');
    }
    this.currentSession = sessionId;
    context.getChannelRef().ack(context.getMessage());
    return { status: 'session_received from RMQ', sessionId };
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched events.',
  })
  async getEvents(@Req() req: any) {
    // First try to use the RMQ-provided session
    if (this.currentSession) {
      console.log('Using RMQ session:', this.currentSession);
      const res = await this.eventService.getEvents(this.currentSession);
      if (res.data.responseStatus === 'SUCCESS') {
        return res;
      }
    }
    const auth = req.headers['authorization'];
    if (!auth) {
      throw new HttpException(
        'Authorization token is missing',
        HttpStatus.UNAUTHORIZED, // 401 status code
      );
    }
    return await this.eventService.getEvents(auth);
  }

  @Get(':eventId')
  @ApiParam({ name: 'eventId', required: true })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched event.',
  })
  async getEventById(@Req() req: any, @Param('eventId') eventId: any) {
    // First try to use the RMQ-provided session
    if (this.currentSession) {
      console.log('Using RMQ session:', this.currentSession);
      return await this.eventService.getEventById(this.currentSession, eventId);
    }
    const auth = req.headers['authorization'];
    if (!auth) {
      throw new HttpException(
        'Authorization token is missing',
        HttpStatus.UNAUTHORIZED, // 401 status code
      );
    }
    return await this.eventService.getEventById(auth, eventId);
  }

  @Post()
  @ApiBody({
    type: Object,
    description: 'Event object',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully created event.',
  })
  async createEvent(@Req() req: any, @Body() body: any) {
    // First try to use the RMQ-provided session
    if (this.currentSession) {
      console.log('Using RMQ session:', this.currentSession);
      return await this.eventService.createEvent(this.currentSession, body);
    }
    const auth = req.headers['authorization'];
    if (!auth) {
      throw new HttpException(
        'Authorization token is missing',
        HttpStatus.UNAUTHORIZED, // 401 status code
      );
    }
    return await this.eventService.createEvent(auth, body);
  }

  @Put(':eventId')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiParam({ name: 'eventId', description: 'ID of the event to update' })
  @ApiBody({
    type: UpdateEventDto,
    description: 'Event object',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Event updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateEvent(
    @Req() req: any,
    @Param('eventId') eventId: string,
    @Body() body: any,
  ) {
    // First try to use the RMQ-provided session
    if (this.currentSession) {
      console.log('Using RMQ session:', this.currentSession);
      return await this.eventService.updateEvent(
        this.currentSession,
        eventId,
        body,
      );
    }
    const auth = req.headers['authorization'];
    if (!auth) {
      throw new HttpException(
        'Authorization token is missing',
        HttpStatus.UNAUTHORIZED, // 401 status code
      );
    }
    return await this.eventService.updateEvent(auth, eventId, body);
  }

  @Post('event/team-members')
  @ApiBody({ type: QueryVeevaDto })
  @ApiHeader({
    name: 'auth',
    description: 'Vault Session ID (use /auth endpoint to get it)',
    required: true,
  })
  async teamMembers(
    @Headers() headers: Record<string, string>,
    @Body() dto: QueryVeevaDto,
  ) {
    if (this.currentSession) {
      console.log('Using RMQ session:', this.currentSession);
      return await this.eventService.eventQyeryObject(
        dto.eventId,
        this.currentSession,
        'em_event_team_member__v',
        'name__v',
      );
    }
    const auth = headers['authorization'];
    if (!auth) {
      throw new HttpException(
        'Authorization token is missing',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const authToken = headers['auth'];

    return this.eventService.eventQyeryObject(
      dto.eventId,
      authToken,
      'em_event_team_member__v',
      'name__v',
    );
  }

  @Post('event/expense-estimate')
  @ApiBody({ type: QueryVeevaDto })
  @ApiHeader({
    name: 'auth',
    description: 'Vault Session ID (use /auth endpoint to get it)',
    required: true,
  })
  async expenceEstimate(
    @Headers() headers: Record<string, string>,
    @Body() dto: QueryVeevaDto,
  ) {
    if (this.currentSession) {
      console.log('Using RMQ session:', this.currentSession);
      return await this.eventService.eventQyeryObject(
        dto.eventId,
        this.currentSession,
        'em_expense_estimate__v',
        'name__v',
      );
    }
    const auth = headers['authorization'];
    if (!auth) {
      throw new HttpException(
        'Authorization token is missing',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const authToken = headers['auth'];
    return this.eventService.eventQyeryObject(
      dto.eventId,
      authToken,
      'em_expense_estimate__v',
      'name__v',
    );
  }

  @Post('event/attendees')
  @ApiBody({ type: QueryVeevaDto })
  @ApiHeader({
    name: 'auth',
    description: 'Vault Session ID (use /auth endpoint to get it)',
    required: true,
  })
  async attendee(
    @Headers() headers: Record<string, string>,
    @Body() dto: QueryVeevaDto,
  ) {
    if (this.currentSession) {
      console.log('Using RMQ session:', this.currentSession);
      return await this.eventService.eventQyeryObject(
        dto.eventId,
        this.currentSession,
        'em_attendee__v',
        'attendee_name__v',
      );
    }
    const auth = headers['authorization'];
    if (!auth) {
      throw new HttpException(
        'Authorization token is missing',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const authToken = headers['auth'];
    return this.eventService.eventQyeryObject(
      dto.eventId,
      authToken,
      'em_attendee__v',
      'attendee_name__v',
    );
  }

  @Post('event/venue')
  @ApiBody({ type: QueryVeevaDto })
  @ApiHeader({
    name: 'auth',
    description: 'Vault Session ID (use /auth endpoint to get it)',
    required: true,
  })
  async venue(
    @Headers() headers: Record<string, string>,
    @Body() dto: QueryVeevaDto,
  ) {
    if (this.currentSession) {
      console.log('Using RMQ session:', this.currentSession);
      return await this.eventService.eventQyeryObject(
        dto.eventId,
        this.currentSession,
        'em_venue__v',
        'venue_name__v',
      );
    }
    const auth = headers['authorization'];
    if (!auth) {
      throw new HttpException(
        'Authorization token is missing',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const authToken = headers['auth'];
    return this.eventService.eventQyeryObject(
      dto.eventId,
      authToken,
      'em_venue__v',
      'venue_name__v',
    );
  }

  @Post('event/speaker')
  @ApiBody({ type: QueryVeevaDto })
  @ApiHeader({
    name: 'auth',
    description: 'Vault Session ID (use /auth endpoint to get it)',
    required: true,
  })
  async speaker(
    @Headers() headers: Record<string, string>,
    @Body() dto: QueryVeevaDto,
  ) {
    if (this.currentSession) {
      console.log('Using RMQ session:', this.currentSession);
      return await this.eventService.eventQyeryObject(
        dto.eventId,
        this.currentSession,
        'em_event_speaker__v',
        'name__v , speaker_name__v',
      );
    }
    const auth = headers['authorization'];
    if (!auth) {
      throw new HttpException(
        'Authorization token is missing',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const authToken = headers['auth'];
    return this.eventService.eventQyeryObject(
      dto.eventId,
      authToken,
      'em_event_speaker__v',
      'name__v , speaker_name__v',
    );
  }

  @Post('event/budget')
  @ApiBody({ type: QueryVeevaDto })
  @ApiHeader({
    name: 'auth',
    description: 'Vault Session ID (use /auth endpoint to get it)',
    required: true,
  })
  async budget(
    @Headers() headers: Record<string, string>,
    @Body() dto: QueryVeevaDto,
  ) {
    if (this.currentSession) {
      console.log('Using RMQ session:', this.currentSession);
      return await this.eventService.eventQyeryObject(
        dto.eventId,
        this.currentSession,
        'em_event_budget__v',
        'budget_name__v',
      );
    }
    const auth = headers['authorization'];
    if (!auth) {
      throw new HttpException(
        'Authorization token is missing',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const authToken = headers['auth'];
    return this.eventService.eventQyeryObject(
      dto.eventId,
      authToken,
      'em_event_budget__v',
      'budget_name__v',
    );
  }
  @Post('event-structured')
  @ApiBody({ type: EventIdDto })
  @ApiHeader({
    name: 'auth',
    description: 'Vault Session ID (use /auth endpoint to get it)',
    required: true,
  })
  async getStructuredEvent(
    @Headers('auth') authToken: string,
    @Body() dto: EventIdDto,
  ) {
    return this.eventService.getStructuredEventPayload(dto.eventId, authToken);
  }

  @Post('/notifications/vault/spark')
  @ApiBody({ type: EventIdDto })
  @ApiHeader({
    name: 'JWT',
    description: 'Vault Session ID (use /auth endpoint to get it)',
    required: true,
  })
  async sparkmsg(
    @Headers('JWT') authToken: string,
    @Body() dto: any,
  ) {
    
    console.log("Spark Message : ",dto);
    return {message:"OK"};
    //return this.eventService.getStructuredEventPayload(dto.eventId, authToken);
  }


  ///notifications/vault/spark
}
