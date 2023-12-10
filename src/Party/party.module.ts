import { Module } from "@nestjs/common";
import { PartyController } from "./party.controller";
import { PartyService } from "./party.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Party } from "./party.entity";
import { UserService } from "src/User/user.service";
import { Address } from "src/Address/address.entity";
import { User } from "src/User/user.entity";
import { Role } from "src/Role/role.entity";
import { Trysts } from "src/Trysts/trysts.entity";
import { WeekendStatus } from "src/WeekendStatus/weekendStatus.entity";


@Module({
    imports:[ TypeOrmModule.forFeature([Party, Address, User, Role, Trysts,Party, WeekendStatus])],
    controllers:[PartyController],
    providers:[PartyService, UserService]
})
export class PartyModule{}