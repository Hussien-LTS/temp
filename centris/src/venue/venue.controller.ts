import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { VenueService } from "./venue.service";
import { ApiTags, ApiBody } from "@nestjs/swagger";
import { CreateVenueTransactionDto } from "./DTOs/create-salesforce-venue.dto";

@ApiTags("Venue")
@Controller("salesforce/venue")
export class VenueController {
  constructor(private readonly venueService: VenueService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiBody({ type: CreateVenueTransactionDto })
  create(@Body() salesforceVenue: CreateVenueTransactionDto) {
    return this.venueService.create(salesforceVenue);
  }
}
