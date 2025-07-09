import { ApiProperty } from "@nestjs/swagger";

export class UserInfoDto {
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
  })
  assignmentPosition: string;
}

export class UserTerrWrapperDto {
  @ApiProperty({
    type: [UserInfoDto],
    description: "List of user information records",
  })
  userInfoList: UserInfoDto[];

  @ApiProperty({
    example: ["EMP-887", "EMP-112", "EMP-683", "EMP-999"],
    description: "List of user identifier IDs",
  })
  userIdList: string[];

  @ApiProperty({
    example: "Demoxyz",
    description: "Name of the territory",
  })
  terrName: string;

  @ApiProperty({
    example: "T000",
    description: "Master ID of the territory",
  })
  terrMasterId: string;

  @ApiProperty({
    example: "T1234",
    description: "Master ID of the parent territory",
  })
  parentMasterId: string;
}

export class CreateSalesforceUserTerritoryDto {
  @ApiProperty({
    type: [UserTerrWrapperDto],
    description: "List of user territory wrapper records",
  })
  UserTerrWrapperList: UserTerrWrapperDto[];

  @ApiProperty({
    example: "DB24433E-F36B-1410-89CA-00DAAF975574",
    description: "Unique ID for the transaction",
  })
  transactionId: string;
}
