import { UUID } from "crypto";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ReportTypeEnum } from "./reporttype.enum";

@Entity()
export class ReportType{
    @PrimaryGeneratedColumn('uuid', {name:"Id"})
    ID:UUID;

    @Column({unique:true, name:"Type", type:'enum', enum:ReportTypeEnum})
    name: ReportTypeEnum;
}