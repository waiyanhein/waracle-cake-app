import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Check,
  OneToMany,
} from "typeorm";
import { CakeImage } from "./cakeImage";

@Entity("cakes")
@Check(`"yumFactor" >= 1 AND "yumFactor" <= 10`)
export class Cake {
  @PrimaryGeneratedColumn() // 👈 default = increment
  id!: number;

  @Column({
    length: 30,
  })
  name!: string;

  @Column({
    length: 200,
  })
  comment!: string;

  @Column({ type: "int", name: "yum_factor" })
  yumFactor!: number;

  @OneToMany(() => CakeImage, (image) => image.cake)
  images!: CakeImage[];
}
