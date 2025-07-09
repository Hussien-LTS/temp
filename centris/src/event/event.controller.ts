import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CentrisEventService } from './event.service';
import { ApiBody, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { VeevaEventWrapperDto } from './DTOs/add-Interaction.dto';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { JwtAuthGuard } from 'src/libs/shared-auth/jwt-auth.guard';

@ApiTags('Centris')
// @UseGuards(JwtAuthGuard)
@Controller('Centris')
export class EventController {
  private access_token: string | null = null;
  constructor(private readonly centrisEventService: CentrisEventService) {}

  @EventPattern('salesforce_auth_response')
  async handleAuthResponse(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('Auth from RMQ', data);
    const access_token = data?.access_token;
    this.access_token = access_token;
    if (!access_token) {
      context.getChannelRef().nack(context.getMessage(), false, false);
      throw new Error('access_token missing in payload');
    }
    context.getChannelRef().ack(context.getMessage());
    return { status: 'access_token received from RMQ', access_token };
  }
  @Post('interaction')
  @ApiHeader({
    name: 'auth',
    description: 'Token JWT',
    required: true,
  })
  @ApiBody({ type: VeevaEventWrapperDto })
  async postInteraction(
    @Headers() headers: Record<string, string>,
    @Body() veevaEventWrapperDto: any,
  ) {
    if (this.access_token) {
      console.log('Using RMQ access_token:', this.access_token);
      const res = await this.centrisEventService.sendInteraction(
        this.access_token,
        veevaEventWrapperDto,
      );
      if (res.success === true) {
        return res;
      }
    }
    const authToken = headers['auth'];
    return this.centrisEventService.sendInteraction(
      authToken,
      veevaEventWrapperDto,
    );
  }

  // @UseGuards(JwtAuthGuard)
  @Get('protected')
  @ApiHeader({
    name: 'auth',
    description: 'Token JWT',
    required: true,
  })
  protectedRoute(@Req() req: any) {
    const token = req.headers['auth'];
    console.log('Token', token);
    return { message: 'Access granted' };
  }
}
