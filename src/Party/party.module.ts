import { Module } from "@nestjs/common";
import { PartyController } from "./party.controller";
import { PartyService } from "./party.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Party } from "./party.entity";
import { AddressModule } from "src/Address/address.module";


@Module({
    imports:[AddressModule, TypeOrmModule.forFeature([Party])],
    controllers:[PartyController],
    providers:[PartyService]
})
export class PartyModule{}