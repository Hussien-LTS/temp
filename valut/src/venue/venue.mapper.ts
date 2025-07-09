import { CreateVenueDto } from './DTOs/create_update_venue.dto';

export function mapVenueInputToVault(input: CreateVenueDto): any[] {
  return input.VenueList.map((venue) => ({
    name__v: venue.VenueName,
    state_province__v: venue.State,
    postal_code__v: venue.PostalCode,
    city__v: venue.City,
    address__v: venue.AddressLine1,
    address_line_2__v: venue.AddressLine2 || '',
    external_id__v: venue.ExternalId,
    legacy_crm_id__v: venue.ExternalId,
  }));
}
