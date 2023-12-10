import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReportController } from "./report.contoller";
import { ReportService } from "./report.service";
import { Report } from "./report.entity";
import { User } from "src/User/user.entity";
import { ReportType } from "src/ReportType/reporttype.entity";

@Module({
    imports:[TypeOrmModule.forFeature([Report, User, ReportType])],
    controllers:[ReportController],
    providers:[ReportService]
})
export class ReportModule{}