
import { UUID } from "crypto";
import { Role } from "src/Role/role.entity";
import { WeekendStatus } from "src/WeekendStatus/weekendStatus.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid',{name:"Id"})
    ID: UUID;

    @Column({name:"Name"})
    name: string;

    @Column({name:"LastName"})
    
    lastName: string;

    @Column({unique:true, name:"UserName"})
    
    userName: string;

    @Column({unique: true, name:"Email"})
    
    email: string;

    @Column({unique:true, name:"PhoneNumber"})
    
    phoneNumber: string;

    @Column({name:"Password"})
    
    password: string;

    @Column({name:"BirthDate"})
    
    birthDate: Date;

    @Column({name:"Balance"})
    
    balance: number;

    @ManyToOne((_type) => Role, (role) => role.ID)
    @JoinColumn({name:"Role"})
    
    role:Role;
    
    @Column({name: "IsDeleted"})
    
    isDeleted: boolean;

    @Column({name:"DateCreated"})
    
    dateCreated: Date;

    @Column({name:"DateUpdated"})
    
    dateUpdated: Date;

    @ManyToOne((_type) => WeekendStatus, (weekendStatus) => weekendStatus.ID)
    @JoinColumn({name:"WeekendStatus"})
    
    weekendStatus:WeekendStatus;
}