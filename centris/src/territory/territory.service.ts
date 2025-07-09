import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { ManageTerritoryDTO } from "./DTOs/manage-territory.dto";
import { RabbitMQService } from "../shared/rabbitmq/rabbitmq.service";
import { mapToTransactionLog } from "../shared/mappers/transaction-log.mapper";

@Injectable()
export class TerritoryService {
  private readonly baseUrl: string | undefined;
  constructor(
    private readonly configService: ConfigService,

    private rmqService: RabbitMQService
  ) {
    this.baseUrl = this.configService.get<string>("SALESFORCE_URL");
  }

  async manageTerritory(auth: string, data: ManageTerritoryDTO): Promise<any> {
    console.log("🚀 ~ TerritoryService ~ manageTerritory ~ data:", data);
    const baseUrl = `${this.baseUrl}/TerritoryManagementAPI`;
    try {
      const response = await axios.post(baseUrl, data, {
        headers: {
          Authorization: `Bearer ${auth}`,
          "Content-Type": "application/json",
        },
        validateStatus: () => true,
      });

      console.log(
        "🚀 ~ TerritoryService ~ manageTerritory ~ mapToTransactionLog(response.data):",
        mapToTransactionLog(response.data)
      );
      await this.rmqService.emit(
        "salesforce-territory-response",
        mapToTransactionLog(response.data)
      );

      if (response.status >= 200 && response.status < 300) {
        console.log(
          "🚀 ~ TerritoryService ~ manageTerritory ~ response.data:",
          response.data
        );
        return response.data;
      } else {
        throw new HttpException("Salesforce API call failed", response.status);
      }
    } catch (error) {
      throw new HttpException(
        error.response?.data || "Salesforce API call failed",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
