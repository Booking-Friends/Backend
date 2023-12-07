import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PresentType } from './PresentType.entity';

@Injectable()
export class PresentTypeService implements OnModuleInit {
    constructor(
        @InjectRepository(PresentType)
        private readonly presentTypeRepository: Repository<PresentType>,
    ) {}

    async onModuleInit() {
        await Promise.all(
            Object.values(PresentType).map(async (PresentTypeName) => {
                const presentTypeExists = await this.presentTypeRepository.findOne({ where : {name: PresentTypeName }});
                if (!presentTypeExists) {
                    const PresentType = this.presentTypeRepository.create({ name: PresentTypeName });
                    await this.presentTypeRepository.save(PresentType);
                }
            })
        );
    }
}
