import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsDate, IsNotEmpty, IsString, IsUUID, isArray } from "class-validator";
import { UUID } from "crypto";

export class PartyDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    description:string;

    @ApiProperty()
    @IsNotEmpty()
    @IsDate()
    dateStarting: Date;

    @ApiProperty()
    @IsNotEmpty()
    @IsDate()
    dateEnding: Date;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    addressId:UUID;

    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    plannerId:UUID;

    @ApiProperty()
    @IsArray()
    @ArrayNotEmpty()
    @IsUUID(4, {each:true})
    partyMembersIds:UUID[];
}