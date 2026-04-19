import Container from "typedi";
import { Cake } from "../entities/cake";
import { StorageService } from "../services/core/storageService";

export type CakeResDto = {
  id: number;
  name: string;
  comment: string;
  yumFactor: number;
  imageUrl: string | null;
};

const storageService = Container.get(StorageService);

export const toCakeResDto = (cake: Cake) => {
  let imageUrl: string | null = null;
  if (cake.images.length) {
    /**
     * @important - ATM, there's always going to be only one image by design.
     */
    imageUrl = storageService.getFileUrl(cake.images[0].path);
  }
  return {
    id: cake.id,
    name: cake.name,
    comment: cake.comment,
    yumFactor: cake.yumFactor,
    imageUrl,
  };
};
