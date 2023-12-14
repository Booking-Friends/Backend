import { Module } from "@nestjs/common";
import { MockService } from "./mock.service";
import { MockController } from "./mock.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Address } from "src/Address/address.entity";
import { Party } from "src/Party/party.entity";
import { Present } from "src/Present/present.entity";
import { UserPresent } from "src/UserPresent/userpresent.entity";
import { PresentType } from "src/PresentType/presenttype.entity";
import { ReportType } from "src/ReportType/reporttype.entity";
import { Report } from "src/Report/report.entity";
import { Role } from "src/Role/role.entity";
import { Trysts } from "src/Trysts/trysts.entity";
import { User } from "src/User/user.entity";
import { WeekendStatus } from "src/WeekendStatus/weekendStatus.entity";
import { PresentService } from "src/Present/present.service";


@Module({
    imports:[TypeOrmModule.forFeature([
        Address,
        Party, 
        Present, 
        UserPresent, 
        PresentType, 
        Report, 
        ReportType,
        Role,
        Trysts,
        User,
        WeekendStatus
    ])],
    controllers:[MockController],
    providers:[MockService, PresentService]
})
export class MockModule{}