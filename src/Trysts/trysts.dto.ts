import { IsNotEmpty, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class Trysts{
    @IsNotEmpty()
    @IsUUID()
    customerId:UUID;

    @IsNotEmpty()
    @IsUUID()
    friendId:UUID;

    @IsNotEmpty()
    @IsUUID()
    dateEnding: Date;

    @IsNotEmpty()
    @IsUUID()
    addressId:UUID;
}