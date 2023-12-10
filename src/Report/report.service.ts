import { Injectable } from "@nestjs/common";
import { ReportDto } from "./report.dto";
import { Report } from "./report.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/User/user.entity";
import { FindManyOptions, Repository } from "typeorm";
import { ReportType } from "src/ReportType/reporttype.entity";

@Injectable()
export class ReportService{
    constructor(
        @InjectRepository(Report) private readonly reportRepository: Repository<Report>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(ReportType) private readonly reportTypeRepository:Repository<ReportType>
    ){
    }

    async getReports(options:FindManyOptions<Report>){
        return this.reportRepository.find(options);
    }

    async saveReport(report: ReportDto){
        const newReport = new Report()
        newReport.title = report.title;
        newReport.reportedTo = await this.userRepository.findOneOrFail({where:{ID:report.reportedTo}});
        newReport.reportedBy = await this.userRepository.findOneOrFail({where:{ID:report.reportedBy}});
        newReport.reportType = await this.reportTypeRepository.findOneOrFail({where:{name:report.reportType}});
        newReport.description = report.description;

        return this.reportRepository.save(newReport)
    }
}