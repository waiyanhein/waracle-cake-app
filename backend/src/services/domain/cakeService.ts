import { Repository } from 'typeorm';
import { AppDataSource } from '../../dataSource';
import { Cake } from '../../entities/cake';
import { Service } from 'typedi';
import { CakeImage } from '../../entities/cakeImage';
import { isNil } from 'lodash';
import { StorageService } from '../core/storageService';
@Service()
export class CakeService {
  private cakeRepo: Repository<Cake>;
  private cakeImageRepo: Repository<CakeImage>;

  constructor(private readonly storageService: StorageService) {
    this.cakeRepo = AppDataSource.getRepository(Cake);
    this.cakeImageRepo = AppDataSource.getRepository(CakeImage);
  }

  public async findOne(id: number): Promise<Cake | null> {
    const cake = await this.cakeRepo.findOne({
      where: {
        id,
      },
    });
    if (isNil(cake)) {
      return null;
    }
    return cake;
  }

  public async findMany({
    page,
    recordsPerPage,
  }: {
    page: number;
    recordsPerPage: number;
  }): Promise<{
    items: Cake[];
    page: number;
    recordsPerPage: number;
    totalItems: number;
    totalPages: number;
  }> {
    const qb = this.cakeRepo
      .createQueryBuilder('cake')
      .leftJoinAndSelect('cake.images', 'image')
      .distinct(true)
      .skip((page - 1) * recordsPerPage)
      .take(recordsPerPage)
      .orderBy('cake.id', 'DESC');

    const [data, total] = await qb.getManyAndCount();
    const totalPages = Math.ceil(total / recordsPerPage);
    return {
      items: data,
      totalItems: total,
      totalPages,
      page,
      recordsPerPage,
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
            await this.storageService.deleteFile(path);
          }),
        );
      }
      throw error;
    }
  }

  public async updateOne(
    id: number,
    data: {
      name: string;
      comment: string;
      yumFactor: number;
      imagePaths: string[];
    },
  ): Promise<void> {
    try {
      const cake = await this.cakeRepo.findOneOrFail({
        where: {
          id,
        },
        relations: {
          images: true,
        },
      });

      await AppDataSource.transaction(async () => {
        await this.cakeRepo.update(id, {
          name: data.name,
          comment: data.comment,
          yumFactor: data.yumFactor,
        });

        await this.cakeImageRepo.delete({
          cakeId: id,
        });

        await this.cakeImageRepo.insert(
          data.imagePaths.map((path) => {
            return {
              path,
              cakeId: id,
            };
          }),
        );
      });

      if (cake.images.length) {
        const deleteFilePromises: Promise<void>[] = [];
        for (const image of cake.images) {
          deleteFilePromises.push(this.storageService.deleteFile(image.path));
        }
        await Promise.all(deleteFilePromises);
      }
    } catch (error) {
      // delete the uploaded images if something went wrong
      if (data.imagePaths.length) {
        const deleteFilePromises: Promise<void>[] = [];
        for (const imagePath of data.imagePaths) {
          deleteFilePromises.push(this.storageService.deleteFile(imagePath));
        }
        await Promise.all(deleteFilePromises);
      }
      throw error;
    }
  }

  public async deleteOne(id: number): Promise<void> {
    await AppDataSource.transaction(async () => {
      // @important - retrieve the images first before the cake is deleted.
      const preExistingImages = await this.cakeImageRepo.find({
        where: {
          cakeId: id,
        },
      });
      await this.cakeRepo.delete(id);
      await this.cakeImageRepo.delete({
        cakeId: id,
      });
      if (preExistingImages.length) {
        const deleteFilePromises: Promise<void>[] = [];
        for (const image of preExistingImages) {
          deleteFilePromises.push(this.storageService.deleteFile(image.path));
        }
        await Promise.all(deleteFilePromises);
      }
    });
  }
}
