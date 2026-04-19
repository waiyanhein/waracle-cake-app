import { Service } from 'typedi';
import { ConfigService } from './configService';

@Service()
export class StorageService {
  constructor(private readonly configService: ConfigService) {}

  public getFileUrl = (filePath: string): string => {
    return `${this.configService.getAppConfig().assetDomain}/${filePath}`;
  };
}
