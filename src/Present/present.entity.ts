import { PresentType } from "src/PresentType/PresentType.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Present{
  @PrimaryGeneratedColumn('uuid', {name:"Id"})
  ID: number;

  @Column({ name:"Name" })
  name: string;

  @Column({ type: 'numeric', name:"Price" })
  price: number;

  @ManyToOne((_type) => PresentType)
  @JoinColumn({name:"Type"})
  type: PresentType;

  @Column('text',{name:"ImageRoot"})
  imageRoot: string;
}