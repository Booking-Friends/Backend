import { UUID } from "crypto";
import { ReportType } from "src/ReportType/reporttype.entity";
import { User } from "src/User/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Report{
    @PrimaryGeneratedColumn('uuid', {name:'Id'})
    ID:UUID;

    @ManyToOne((_type) => User)
    @JoinColumn({name:"ReportedBy"})
    reportedBy:User;

    @ManyToOne((_type) => User)
    @JoinColumn({name:"ReportedTo"})
    reportedTo:User;

    @Column({name:"Title"})
    title:string;

    @Column('text', {name:"Description"})
    description:string;

    @ManyToOne((_type) => ReportType)
    @JoinColumn({name:"ReportType"})
    reportType:ReportType

    @CreateDateColumn({name:"DateCreated"})
    dateCreated: Date;
}