import { UUID } from "crypto";
import { Party } from "src/Party/party.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Address{
    @PrimaryGeneratedColumn('uuid',{name:'Id'})
    ID: UUID;

    @Column({name:'Country'})
    country:string;

    @Column({name:'City'})
    city:string;

    @Column({name:'Street'})
    street:string;

    @Column({name:'ApartmentNumber'})
    aparetmentNumber:string;

    @Column({name:"ZipCode"})
    zipCode:number;
}