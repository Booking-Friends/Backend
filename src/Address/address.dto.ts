import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AddressDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    country:string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    city:string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    street:string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    aparetmentNumber:string;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    zipCode:number;
}