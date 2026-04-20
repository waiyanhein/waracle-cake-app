import type { CakeResDto } from './cakeResDto';

export type CakeFindManyResDto = {
  items: CakeResDto[];
  page: number;
  recordsPerPage: number;
  totalItems: number;
  totalPages: number;
};
