import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AddressDto{
    @IsNotEmpty()
    @IsString()
    country:string;

    @IsNotEmpty()
    @IsString()
    city:string;

    @IsNotEmpty()
    @IsString()
    street:string;

    @IsNotEmpty()
    @IsString()
    aparetmentNumber:string;
    
    @IsNotEmpty()
    @IsNumber()
    zipCode:number;
}