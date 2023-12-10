import { Module } from "@nestjs/common";
import { TrystsController } from "./trysts.controller";
import { TrystsService } from "./trysts.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Trysts } from "./trysts.entity";


@Module({
    imports:[TypeOrmModule.forFeature([Trysts])],
    controllers:[TrystsController],
    providers:[TrystsService]
})
export class TrystsModule{}