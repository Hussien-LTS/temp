import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')],
      queue: 'salesforce_budget_queue',
      queueOptions: { durable: false },
      noAck: false,
    },
  });
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')],
      queue: 'salesforce_topic_queue',
      queueOptions: { durable: false },
      noAck: false,
    },
  });

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')],
      queue: 'salesforce_attendee_queue',
      queueOptions: { durable: false },
      noAck: false,
    },
  });

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')],
      queue: 'salesforce_venue_queue',
      queueOptions: { durable: false },
      noAck: false,
    },
  });

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')],
      queue: 'vault_territory_queue',
      queueOptions: { durable: false },
      noAck: false,
    },
  });

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')],
      queue: 'salesforce-territory_queue',
      queueOptions: { durable: false },
      noAck: false,
    },
  });

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')],
      queue: 'user_vault_queue',
      queueOptions: { durable: false },
      noAck: false,
    },
  });

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')],
      queue: 'salesforce_user_queue',
      queueOptions: { durable: false },
      noAck: false,
    },
  });

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')],
      queue: 'veeva_user_territory_queue',
      queueOptions: { durable: false },
      noAck: false,
    },
  });

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')],
      queue: 'salesforce_user_territory_queue',
      queueOptions: { durable: false },
      noAck: false,
    },
  });

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')],
      queue: 'attachment_vault_queue',
      queueOptions: { durable: false },
      noAck: false,
    },
  });

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')],
      queue: 'salesforce_attachment_queue',
      queueOptions: { durable: false },
      noAck: false,
    },
  });

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')],
      queue: 'expansion-rule',
      queueOptions: { durable: false },
      noAck: false,
    },
  });

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')],
      queue: 'configruble-api',
      queueOptions: { durable: false },
      noAck: false,
    },
  });

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')],
      queue: 'topic_vault_queue',
      queueOptions: { durable: false },
      noAck: false,
    },
  });
  await app.startAllMicroservices();

  const port = configService.get<number>('PORT');
  await app.listen(port ?? 3009);
}
bootstrap();
