import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from "typeorm";
  import { Cake } from "./cake";
  
  @Entity("cake_images")
  export class CakeImage {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column({ length: 255 })
    path!: string;
  
    @Column({ name: "cake_id" })
    cakeId!: number;
  
    @ManyToOne(() => Cake, (cake) => cake.images, {
      onDelete: "CASCADE",
    })
    @JoinColumn({ name: "cake_id" })
    cake!: Cake;
  }