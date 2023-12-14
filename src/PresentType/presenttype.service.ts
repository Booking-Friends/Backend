import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PresentType } from './presenttype.entity';
import { PresentTypeEnum } from './presenttype.enum';

@Injectable()
export class PresentTypeService implements OnModuleInit {
    constructor(
        @InjectRepository(PresentType)
        private readonly presentTypeRepository: Repository<PresentType>,
    ) {}

    async onModuleInit() {
        await Promise.all(
            Object.values(PresentTypeEnum).map(async (PresentTypeName) => {
                const presentTypeExists = await this.presentTypeRepository.findOne({ where : {name: PresentTypeName }});
                if (!presentTypeExists) {
                    const PresentType = this.presentTypeRepository.create({ name: PresentTypeName });
                    await this.presentTypeRepository.save(PresentType);
                }
            })
        );
    }
}
