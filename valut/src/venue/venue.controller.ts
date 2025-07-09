import {
  Controller,
  Body,
  ForbiddenException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { VenueService } from './venue.service';
import { ApiTags, ApiSecurity, ApiBody } from '@nestjs/swagger';
import { SessionStoreService } from 'src/sessionValidation/sessionValidation.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { CreateVenueDto } from './DTOs/create_update_venue.dto';

@ApiTags('Venue')
@ApiSecurity('sessionId')
@Controller('vault/v1/venue')
export class VenueController {
  private sessionId: string;

  constructor(
    private readonly venueService: VenueService,
    private readonly sessionStore: SessionStoreService,
  ) {}

  @EventPattern('vault_auth_response')
  handleVaultAuth(@Payload() data: any, @Ctx() context: RmqContext) {
    this.sessionId = data?.sessionId;
    if (!this.sessionId) {
      context.getChannelRef().nack(context.getMessage(), false, false);
      throw new ForbiddenException();
    }

    this.sessionStore.set(data.sessionId);
  }

  @Post()
  @ApiBody({ type: CreateVenueDto })
  create(@Body() createVenueDto: CreateVenueDto, @Ctx() context: RmqContext) {
    console.log(
      '🚀 ~ VenueController ~ create ~ createVenueDto:',
      createVenueDto,
    );
    const sessionData = this.sessionId;
    if (!sessionData) {
      throw new UnauthorizedException('Session ID is missing or invalid.');
    }
    return this.venueService.create(createVenueDto, sessionData);
  }
}
