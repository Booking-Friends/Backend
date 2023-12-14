import { Module} from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Role } from "src/Role/role.entity";
import { Trysts } from "src/Trysts/trysts.entity";
import { Party } from "src/Party/party.entity";
import { WeekendStatus } from "src/WeekendStatus/weekendStatus.entity";

@Module({
    imports:[TypeOrmModule.forFeature([User, Role, Trysts, Party, WeekendStatus])],
    controllers:[UserController],
    providers:[UserService],
    exports:[UserService]
})
export class UserModule{}