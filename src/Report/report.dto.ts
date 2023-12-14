import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { UUID } from "crypto";
import { ReportTypeEnum } from "src/ReportType/reporttype.enum";


export class ReportDto{
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty()
    reportedBy:UUID;

    @IsNotEmpty()
    @IsUUID()
    @ApiProperty()
    reportedTo:UUID;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    title:string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    description:string;

    @ApiProperty({enum: ReportTypeEnum})
    @IsEnum(ReportTypeEnum)
    @IsNotEmpty()
    reportType:ReportTypeEnum;
}