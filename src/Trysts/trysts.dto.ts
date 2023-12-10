import { IsDate, IsNotEmpty, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class TrystsDto{
    @IsNotEmpty()
    @IsUUID()
    customerId:UUID;

    @IsNotEmpty()
    @IsUUID()
    friendId:UUID;

    @IsNotEmpty()
    @IsDate()
    dateStarting:Date;

    @IsNotEmpty()
    @IsUUID()
    dateEnding: Date;

    @IsNotEmpty()
    @IsUUID()
    addressId:UUID;
}