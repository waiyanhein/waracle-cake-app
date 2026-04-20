import { Service } from 'typedi';
import { ConfigService } from './configService';
import { unlink } from 'fs/promises';
@Service()
export class StorageService {
  constructor(private readonly configService: ConfigService) {}

  public getFileUrl = (filePath: string): string => {
    return `${this.configService.getAppConfig().assetDomain}/${filePath}`;
  };

  /**
   * @notes - to make it easier to adapt to new storage service.
   * For example, if we switch to S3, we just need to update this service.
   */
  public deleteFile = (filePath: string): Promise<void> => {
    return unlink(filePath);
  };
}
