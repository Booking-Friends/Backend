import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import { RoleEnum } from "src/Role/role.enum";
import { WeekendStatusEnum } from "src/WeekendStatus/weekendStatus.enum";
export class UserDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    userName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsPhoneNumber()
    phoneNumber: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsDate()
    birthDate: Date;

    @ApiProperty({enum: RoleEnum})
    @IsEnum(RoleEnum)
    @IsNotEmpty()
    role:RoleEnum;

    @ApiProperty({enum: WeekendStatusEnum})
    @IsEnum(WeekendStatusEnum)
    @IsOptional()
    weekendStatus?:WeekendStatusEnum;
}