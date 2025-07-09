/* eslint-disable prettier/prettier */
import { Injectable, Logger } from "@nestjs/common";
import { RabbitMQService } from "../shared/rabbitmq/rabbitmq.service";
// import { SalesforceTopicDto } from "./DTOs/create-salesforce-topic.dto";

@Injectable()
export class TopicService {
  private readonly logger = new Logger(TopicService.name);
  constructor(private rmqService: RabbitMQService) {}

  async create(createSalesforceTopicDto: any) {
    // this.logger.log("🚀 ~ TopicService ~ create ~ create:")
    // this.logger.log(createSalesforceTopicDto);
    const res = await this.rmqService.send(
      `salesforce-topic-created`,
      createSalesforceTopicDto
    );
    // console.log("🚀 ~ TopicService ~ create ~ res:", res)
    // this.logger.log("🚀 ~ TopicService ~ create ~ Message sent to RabbitMQ")
    return {
      success: true,
      message: "Topic created successfully",
      data: res,
    };
  }
}
