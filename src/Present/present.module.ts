import { Module } from "@nestjs/common";
import { PresentController } from "./present.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Present } from "./present.entity";
import { PresentService } from "./present.service";
import { UserPresent } from "src/UserPresent/userpresent.entity";
import { User } from "src/User/user.entity";
import { PresentType } from "src/PresentType/presenttype.entity";



@Module({
    imports:[TypeOrmModule.forFeature([Present, UserPresent, User, PresentType])],
    controllers:[PresentController],
    providers:[PresentService]
})
export class PresentModule{}