import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RmqLoggerService {
  async readMessagesFromQueue(queueName: string): Promise<string[]> {
    const messages: string[] = [];
    const connection = await amqp.connect('amqp://admin:admin@rabbitmq:5672');
    const channel = await connection.createChannel();

    try {
      await channel.assertQueue(queueName, { durable: false });

      let msg;
      while ((msg = await channel.get(queueName, { noAck: true }))) {
        messages.push(msg.content.toString());
      }
    } catch (err) {
      messages.push(`Error: ${err.message}`);
    } finally {
      await channel.close();
      await connection.close();
    }

    return messages;
  }
}
