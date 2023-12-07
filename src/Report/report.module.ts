import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReportController } from "./report.contoller";
import { ReportService } from "./report.service";
import { Report } from "./report.entity";

@Module({
    imports:[TypeOrmModule.forFeature([Report])],
    controllers:[ReportController],
    providers:[ReportService]
})
export class ReportModule{}