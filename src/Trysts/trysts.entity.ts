import { UUID } from "crypto";
import { Address } from "src/Address/Address.entity";
import { User } from "src/User/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Trysts{
    @PrimaryGeneratedColumn('uuid', {name:"Id"})
    ID:UUID;

    @ManyToOne((_type) => User)
    @JoinColumn({name:"TrystCustomer"})
    customer:User;

    @ManyToOne((_type) => User)
    @JoinColumn({name:"TrystFriend"})
    friend:User;

    @Column({name:"DateEnding"})
    dateEnding: Date;

    @ManyToOne((_type) =>Address)
    @JoinColumn({name:"Address"})
    address:Address;

    @CreateDateColumn({name:"DateCreated"})
    dateCreated: Date;

    @UpdateDateColumn({name:"DateUpdated"})
    dateUpdated: Date;
}