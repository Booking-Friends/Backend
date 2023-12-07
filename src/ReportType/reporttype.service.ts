import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportType } from './reporttype.entity';
import { ReportTypeEnum } from './reporttype.enum';

@Injectable()
export class ReportTypeService implements OnModuleInit {
    constructor(
        @InjectRepository(ReportType)
        private readonly reporttypeRepository: Repository<ReportType>,
    ) {}

    async onModuleInit() {
        await Promise.all(
            Object.values(ReportTypeEnum).map(async (reporttypeName) => {
                const reporttypeExists = await this.reporttypeRepository.findOne({ where : {name: reporttypeName }});
                if (!reporttypeExists) {
                    const reporttype = this.reporttypeRepository.create({ name: reporttypeName });
                    await this.reporttypeRepository.save(reporttype);
                }
            })
        );
    }
}
