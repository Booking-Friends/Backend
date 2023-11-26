import { Module} from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Role } from "src/Role/role.entity";

@Module({
    imports:[TypeOrmModule.forFeature([User, Role])],
    controllers:[UserController],
    providers:[UserService],
    exports:[UserService]
})
export class UserModule{}