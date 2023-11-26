import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { RoleEnum } from './role.enum';

@Injectable()
export class RoleService implements OnModuleInit {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) {}

    async onModuleInit() {
        await Promise.all(
            Object.values(RoleEnum).map(async (roleName) => {
                const roleExists = await this.roleRepository.findOne({ where : {name: roleName }});
                if (!roleExists) {
                    const role = this.roleRepository.create({ name: roleName });
                    await this.roleRepository.save(role);
                }
            })
        );
    }
}
