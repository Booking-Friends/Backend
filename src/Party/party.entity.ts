import { UUID } from "crypto";
import { Address } from "../Address/Address.entity";
import { User } from "../User/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Party{
    @PrimaryGeneratedColumn('uuid', {name:"Id"})
    ID:UUID;

    @Column({name:"Name"})
    name: string;

    @Column({name:"Description"})
    description:string;

    @Column({name:"DateStarting"})
    dateStarting: Date;

    @Column({name:"DateEnding"})
    dateEnding: Date;

    @ManyToOne((_type) => Address)
    @JoinColumn({name:"Address"})
    address:Address;

    @ManyToOne((_type) => User)
    @JoinColumn({name:"Planner"})
    planner:User;

    @ManyToMany((_type) => User)
    @JoinTable({name:"PartyMembers"})
    partyMembers:User[];

    @CreateDateColumn({name:"DateCreated"})
    dateCreated: Date;

    @UpdateDateColumn({name:"DateUpdated"})
    dateUpdated: Date;
}