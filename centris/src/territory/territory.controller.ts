import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices";
import { TerritoryService } from "./territory.service";
import { ApiBody, ApiResponse } from "@nestjs/swagger";
import { ManageTerritoryDTO } from "./DTOs/manage-territory.dto";

@Controller("centris")
export class TerritoryController {
  private access_token: string | null = null;
  constructor(private readonly territoryService: TerritoryService) {}
  @EventPattern("salesforce_auth_response")
  handleAuthResponse(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log("Auth from RMQ", data);
    const access_token = data?.access_token;
    this.access_token = access_token;
    if (!access_token) {
      context.getChannelRef().nack(context.getMessage(), false, false);
      throw new Error("access_token missing in payload");
    }
    context.getChannelRef().ack(context.getMessage());
    return { status: "access_token received from RMQ", access_token };
  }
  @Post("territory")
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  )
  @ApiBody({ type: ManageTerritoryDTO })
  @ApiResponse({
    status: 201,
    description: "Territory successfully created and response returned.",
  })
  async createTerritory(@Body() data: ManageTerritoryDTO) {
    if (!this.access_token) {
      throw new Error("Access token is missing");
    } else {
      const response = await this.territoryService.manageTerritory(
        this.access_token,
        data
      );
      return response;
    }
  }
}
