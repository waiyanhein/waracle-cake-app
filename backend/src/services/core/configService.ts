import { Service } from 'typedi';

type AppConfig = {
  env: string;
  database: {
    url: string;
  };
  storage: {
    directory: string;
  };
  assetDomain: string;
};

@Service()
export class ConfigService {
  private config: AppConfig | undefined;

  public getAppConfig(): AppConfig {
    if (!this.config) {
      this.config = {
        env: process.env.NODE_ENV!,
        database: {
          url: process.env.DATABASE_URL!,
        },
        storage: {
          directory: process.env.STORAGE_DIRECTORY!,
        },
        assetDomain: process.env.ASSET_DOMAIN!,
      };
    }
    return this.config;
  }
}
