import { UUID } from "crypto";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { RoleEnum } from "./role.enum";


@Entity()
export class Role{
    @PrimaryGeneratedColumn('uuid', {name:"Id"})
    ID:UUID;

    @Column({unique:true, name:"Name", type:'enum', enum:RoleEnum})
    name: RoleEnum;
}