import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class TrystsDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    customerId:UUID;

    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    friendId:UUID;

    @ApiProperty()
    @IsNotEmpty()
    @IsDate()
    dateStarting:Date;

    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    dateEnding: Date;

    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    addressId:UUID;
}