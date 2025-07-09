import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from 'src/entities/event.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async createEvent(eventData: any): Promise<Event[]> {
    try {
      const event = this.eventRepository.create(eventData);
      return await this.eventRepository.save(event);
    } catch (error) {
      throw new Error(`Failed to create event: ${error.message}`);
    }
  }
}
