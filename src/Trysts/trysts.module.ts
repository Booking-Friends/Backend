import { Module } from "@nestjs/common";
import { TrystsController } from "./trysts.controller";
import { TrystsService } from "./trysts.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Trysts } from "./trysts.entity";
import { Address } from "src/Address/address.entity";
import { User } from "src/User/user.entity";
import { UserService } from "src/User/user.service";
import { WeekendStatus } from "src/WeekendStatus/weekendStatus.entity";
import { Role } from "src/Role/role.entity";
import { Party } from "src/Party/party.entity";


@Module({
    imports:[TypeOrmModule.forFeature([Trysts, Address, User, WeekendStatus, Role, Party])],
    controllers:[TrystsController],
    providers:[TrystsService, UserService]
})
export class TrystsModule{}