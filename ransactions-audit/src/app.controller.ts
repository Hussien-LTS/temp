import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { RmqLoggerService } from './rmqlog.service';

@ApiTags('Logs') // Adds a tag section in Swagger UI
@Controller('logs')
export class AppController {
  constructor(private readonly rmqLoggerService: RmqLoggerService) {}

  @Get()
  @ApiQuery({
    name: 'queue',
    type: String,
    required: true,
    description: 'RabbitMQ queue name to read logs from',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns logs from the specified RabbitMQ queue',
    schema: {
      example: {
        queue: 'example-queue',
        logs: ['Log message 1', 'Log message 2'],
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Missing queue query parameter',
    schema: {
      example: { error: 'Missing "queue" query parameter' },
    },
  })
  async getLogs(@Query('queue') queue: string): Promise<any> {
    if (!queue) {
      return { error: 'Missing "queue" query parameter' };
    }

    const logs = await this.rmqLoggerService.readMessagesFromQueue(queue);
    return { queue, logs };
  }
}
