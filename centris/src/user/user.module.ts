import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { RabbitMQModule } from "src/shared/rabbitmq/rabbitmq.module";

@Module({
  imports: [RabbitMQModule.register("salesforce_user_queue")],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
