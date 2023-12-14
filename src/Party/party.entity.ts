import { UUID } from "crypto";
import { Address } from "../Address/address.entity";
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

    @Column('timestamp',{name:"DateStarting"})
    dateStarting: Date;

    @Column('timestamp',{name:"DateEnding"})
    dateEnding: Date;

    @ManyToOne((_type) => Address, {nullable:false})
    @JoinColumn({name:"Address"})
    address:Address;

    @ManyToOne((_type) => User, {nullable:false})
    @JoinColumn({name:"Planner"})
    planner:User;

    @ManyToMany((_type) => User,{nullable:false})
    @JoinTable({name:"PartyMembers"})
    partyMembers:User[];

    @CreateDateColumn({name:"DateCreated"})
    dateCreated: Date;

    @UpdateDateColumn({name:"DateUpdated"})
    dateUpdated: Date;
}