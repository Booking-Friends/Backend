import { UUID } from "crypto";
import { PresentType } from "src/PresentType/presenttype.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Present{
  @PrimaryGeneratedColumn('uuid', {name:"Id"})
  ID: UUID;

  @Column({ name:"Name" })
  name: string;

  @Column({ type: 'numeric', name:"Price" })
  price: number;

  @ManyToOne((_type) => PresentType)
  @JoinColumn({name:"Type"})
  type: PresentType;

  @Column('text',{name:"Image"})
  image: string;
}