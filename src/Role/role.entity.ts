import { UUID } from "crypto";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Role{
    @PrimaryGeneratedColumn('uuid', {name:"Id"})
    ID:UUID;

    @Column({unique:true, name:"Name"})
    name: string;
}