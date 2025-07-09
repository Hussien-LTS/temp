import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Headers,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags, ApiHeader } from '@nestjs/swagger';
import { SpeakerAttendeeService } from './speaker-attendee.service';
import { LitsAttendeeInfoDto } from './DTOs/attendee-info.dto';

@ApiTags('Speaker Attendee')
@Controller('speaker-attendee')
export class SpeakerAttendeeController {
  constructor(
    private readonly speakerAttendeeService: SpeakerAttendeeService,
  ) {}

  @ApiBody({ type: LitsAttendeeInfoDto })
  @ApiHeader({
    name: 'auth',
    description: 'Vault Session ID (use /auth endpoint to get it)',
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  @Post('list-attendees-info')
  @ApiOperation({
    summary:
      'List attendee Information from external ids from Salesforce And Send It To Veeva Vault',
  })
  async litsAttendeesInfo(
    @Headers('auth') authToken: string,
    @Body() payload: LitsAttendeeInfoDto,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.speakerAttendeeService.litsAttendeesInfo(
      authToken,
      payload,
    );
  }
}
