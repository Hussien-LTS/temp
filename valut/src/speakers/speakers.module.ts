import { Module } from '@nestjs/common';
import { SpeakersController } from './speakers.controller';
import { SpeakersService } from './speakers.service';

@Module({
  controllers: [SpeakersController],
  providers: [SpeakersService]
})
export class SpeakersModule {}
