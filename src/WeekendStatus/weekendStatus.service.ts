import { WeekendStatus } from 'src/WeekendStatus/weekendStatus.entity';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeekendStatusEnum } from './weekendStatus.enum';

@Injectable()
export class WeekendStatusService implements OnModuleInit {
    constructor(
        @InjectRepository(WeekendStatus)
        private readonly weekendStatusRepository: Repository<WeekendStatus>,
    ) {}

    async onModuleInit() {
        await Promise.all(
            Object.values(WeekendStatusEnum).map(async (status) => {
                const roleExists = await this.weekendStatusRepository.findOne({ where : {status: status}});
                if (!roleExists) {
                    const weekendStatus = this.weekendStatusRepository.create({ status: status});
                    await this.weekendStatusRepository.save(weekendStatus);
                }
            })
        );
    }
}
