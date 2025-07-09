import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RmqLoggerService } from './rmqlog.service';
import { ConfigModule } from '@nestjs/config';
import { ConfigrubleApiModule } from './configrabule-api/configrabule-api.module';
import { ExpansionRuleModule } from './expansion-rule/expansion-rule.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ConfigrubleApiModule,
    ExpansionRuleModule,
  ],
  controllers: [AppController],
  providers: [RmqLoggerService],
})
export class AppModule {}
