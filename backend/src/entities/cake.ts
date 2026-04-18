// src/entities/User.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Check,
  } from "typeorm";
  
  // @Entity decorator marks this class as a database table
  // Table name defaults to class name in lowercase
  @Entity("cakes")
  @Check(`"yumFactor" >= 1 AND "yumFactor" <= 10`)
  export class Cake {
    // Auto-generated UUID primary key
    @PrimaryGeneratedColumn() // 👈 default = increment
    id!: string;
  
    // Indexed column for faster lookups
    @Column({
      length: 30
    })
    name!: string;

    @Column({
      length: 200
    })
    comment!: string;

    @Column({ type: "int" })
    yumFactor!: number;

    @Column({
      nullable: true
    })
    imageUrl?: string;
  }
