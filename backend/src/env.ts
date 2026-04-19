import path from 'path';
import dotenv from 'dotenv';

const env = process.env.NODE_ENV;
export const initDotenv = () => {
  dotenv.config({
    path: env ? path.join(process.cwd(), `.env.${process.env.NODE_ENV}`) : undefined,
  });
};
