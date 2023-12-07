import { Present } from "src/Present/present.entity";
import { User } from "src/User/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UUID } from "typeorm/driver/mongodb/bson.typings";

@Entity()
export class UserPresent{
    @PrimaryGeneratedColumn('uuid', {name:"Id"})
    ID:UUID;

    @ManyToOne((_type) => User)
    @JoinColumn({name:"PresentFrom"})
    presentFrom:User;

    @ManyToOne((_type) => User)
    @JoinColumn({name:"PresentTo"})
    presentTo:User;

    @ManyToOne((_type) => Present)
    @JoinColumn({name:"Present"})
    present:Present;

    @CreateDateColumn({name:"DateCreated"})
    dateCreated: Date;

    @Column({name:"IsReturned", default:false})
    isReturned:boolean;

    @Column({name:"DateReturned", nullable:true})
    dateReturned:Date;
}