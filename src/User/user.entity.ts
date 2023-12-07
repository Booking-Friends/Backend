
import { UUID } from "crypto";
import { Role } from "src/Role/role.entity";
import { WeekendStatus } from "src/WeekendStatus/weekendStatus.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @Column({name:"BirthDate", type:"date"})
    birthDate: Date;

    @Column({name:"Balance", default: 0})
    balance: number;

    @ManyToOne((_type) => Role)
    @JoinColumn({name:"Role"})
    role:Role;
    
    @Column({name: "IsDeleted", default: false})
    isDeleted?: boolean;

    @CreateDateColumn({name:"DateCreated"})
    dateCreated: Date;

    @UpdateDateColumn({name:"DateUpdated"})
    dateUpdated: Date;

    @ManyToOne((_type) => WeekendStatus, (weekendStatus) => weekendStatus.ID, {nullable: true})
    @JoinColumn({name:"WeekendStatusID"})
    weekendStatus?:WeekendStatus;
}