import { Module } from "@nestjs/common";
import { PresentController } from "./present.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Present } from "./present.entity";
import { PresentService } from "./present.service";



@Module({
    imports:[TypeOrmModule.forFeature([Present])],
    controllers:[PresentController],
    providers:[PresentService]
})
export class PresentModule{}