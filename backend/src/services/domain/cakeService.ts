import { Repository } from "typeorm";
import { AppDataSource } from "../../dataSource";
import { Cake } from "../../entities/cake";
import { Service } from "typedi";
import { CakeImage } from "../../entities/cakeImage";
import { unlink } from "fs/promises";
@Service()
export class CakeService {
  private cakeRepo: Repository<Cake>;
  private cakeImageRepo: Repository<CakeImage>;

  constructor() {
    this.cakeRepo = AppDataSource.getRepository(Cake);
    this.cakeImageRepo = AppDataSource.getRepository(CakeImage);
  }

  public async findMany({
    page,
    recordsPerPage,
  }: {
    page: number;
    recordsPerPage: number;
  }): Promise<{
    data: Cake[];
    total: number;
    totalPages: number;
  }> {
    const qb = this.cakeRepo
      .createQueryBuilder("cake")
      .leftJoinAndSelect("cake.images", "image")
      .distinct(true)
      .skip((page - 1) * recordsPerPage)
      .take(recordsPerPage)
      .orderBy("cake.id", "DESC");

    const [data, total] = await qb.getManyAndCount();
    const totalPages = Math.ceil(total / recordsPerPage);
    return {
      data,
      total,
      totalPages,
    };
  }

  public async createOne(data: {
    name: string;
    comment: string;
    yumFactor: number;
    imagePaths: string[];
  }): Promise<Cake> {
    try {
      return await AppDataSource.transaction(async () => {
        const cake = await this.cakeRepo.save({
          name: data.name,
          comment: data.comment,
          yumFactor: data.yumFactor,
        });

        if (data.imagePaths.length) {
          await this.cakeImageRepo.insert(
            data.imagePaths.map((path) => {
              return {
                path,
                cakeId: cake.id,
              };
            }),
          );
        }
        return cake;
      });
    } catch (error) {
      /**
       * @notes - the uploaded images as the images were not saved into the database.
       */
      if (data.imagePaths.length) {
        await Promise.all(
          data.imagePaths.map(async (path) => {
            await unlink(path);
          }),
        );
      }
      throw error;
    }
  }
}
