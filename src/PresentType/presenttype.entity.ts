
import { UUID } from "crypto";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { PresentTypeEnum } from "./presenttype.enum";


@Entity()
export class PresentType{
    @PrimaryGeneratedColumn('uuid', {name:"Id"})
    ID:UUID;

    @Column({unique:true, name:"Name", type:'enum', enum:PresentTypeEnum})
    name: PresentTypeEnum;
}