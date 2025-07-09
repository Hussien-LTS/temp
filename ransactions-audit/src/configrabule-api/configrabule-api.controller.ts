import { Controller, Get } from '@nestjs/common';
import { ConfigrubleApiService } from './configrabule-api.service';

@Controller('admin/configruble-api')
export class ConfigrubleApiController {
  constructor(private readonly configrabuleService: ConfigrubleApiService) {}

  @Get()
  async getAllConfigrableApi() {
    return await this.configrabuleService.getAllConfigrabuleApi();
  }
}
