import { ArrayNotEmpty, IsArray, IsDate, IsNotEmpty, IsString, IsUUID, isArray } from "class-validator";
import { UUID } from "crypto";

export class PartDto{
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description:string;

    @IsNotEmpty()
    @IsDate()
    dateStarting: Date;

    @IsNotEmpty()
    @IsDate()
    dateEnding: Date;
    
    @IsNotEmpty()
    @IsUUID()
    addressId:UUID;

    @IsNotEmpty()
    @IsUUID()
    plannerId:UUID;

    @IsArray()
    @ArrayNotEmpty()
    @IsUUID(4, {each:true})
    partyMembersIds:UUID[];
}