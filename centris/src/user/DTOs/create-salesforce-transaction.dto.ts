import { ApiProperty } from "@nestjs/swagger";

export class UserDataDto {
  @ApiProperty({
    example: true,
    description: "Status indicating if the user is active",
  })
  userStatus: boolean;

  @ApiProperty({
    example: "Sales Representative",
    description: "Role of the user in the organization",
  })
  userRole: string;

  @ApiProperty({
    example: "Veeva Essentials Sales Profile",
    description: "User profile type or category",
  })
  userProfile: string;

  @ApiProperty({
    example: "Jones",
    description: "Last name of the user",
  })
  userLastName: string;

  @ApiProperty({
    example: "EMP-999",
    description: "Unique identifier for the user",
  })
  userIdentifierId: string;

  @ApiProperty({
    example: "Amy",
    description: "First name of the user",
  })
  userFirstName: string;

  @ApiProperty({
    example: "CA",
    description: "Home state/province of the user",
  })
  homeState: string;

  @ApiProperty({
    example: "94105",
    description: "Home postal/zip code of the user",
  })
  homePostalCode: string;

  @ApiProperty({
    example: "US",
    description: "Home country of the user",
  })
  homeCountry: string;

  @ApiProperty({
    example: "1 Market St",
    description: "Home address line 1 of the user",
  })
  homeAddressLine1: string;

  @ApiProperty({
    example: "Primary",
    description: "Assignment position of the user",
    nullable: true,
  })
  assignmentPosition: string | null;
}

export class CreateSalesforceUserTransactionDto {
  @ApiProperty({
    type: [UserDataDto],
    description: "List of user data records",
  })
  userDataList: UserDataDto[];

  @ApiProperty({
    example: "DB24433E-F36B-1410-89CA-00DAAF975574",
    description: "Unique ID for the transaction",
  })
  transactionId: string;
}
