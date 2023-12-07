import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { UUID } from "crypto";
import { ReportTypeEnum } from "src/ReportType/reporttype.enum";


export class ReportDto{
    @IsNotEmpty()
    @IsUUID()
    reportedBy:UUID;

    @IsNotEmpty()
    @IsUUID()
    reportedTo:UUID;

    @IsNotEmpty()
    @IsString()
    title:string;

    @IsNotEmpty()
    @IsString()
    description:string;

    @ApiProperty({enum: ReportTypeEnum})
    @IsEnum(ReportTypeEnum)
    @IsNotEmpty()
    reportType:ReportTypeEnum;

}