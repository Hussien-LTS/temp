import { Body, Controller, Headers, Post, Req, Res } from '@nestjs/common';
import { SparkService } from './spark.service';
import { SparkMessageDto } from './dtos/sparkMessage.dto';
import { ApiBody, ApiHeader } from '@nestjs/swagger';

@Controller('spark')
export class SparkController {
  constructor(private readonly sparkService: SparkService) {}
  @Post('message')
  @ApiBody({ type: SparkMessageDto })
  @ApiHeader({
    name: 'auth',
    description: 'Vault Session ID (use /auth endpoint to get it)',
    required: true,
  })
  handleSparkMessage(
    @Headers('auth') authToken: string,
    @Body() message: SparkMessageDto,
  ) {
    return this.sparkService.handleSparkMessage(message, authToken);
  }
}
