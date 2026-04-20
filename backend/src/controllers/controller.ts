import { NextFunction, Request, Response, RequestHandler } from 'express';
import multer from 'multer';
import path from 'path';
import { mkdir } from 'fs';
import { ConfigService } from '../services/core/configService';
import Container from 'typedi';
import { ZodError, ZodIssue } from 'zod';
import { FileUploadError } from '../errors/fileUploadError';
import { isNil } from 'lodash';

type RequestValidationErrors = Record<string, string[]>;

type ConfigureUploadMiddlewareArgs = {
  fields: multer.Field[];
  filenameHandler: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => void;
  fileFilterHandler?: (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
  ) => void;
};

export class Controller {
  protected configService: ConfigService;

  constructor() {
    this.configService = Container.get(ConfigService);
  }

  protected configureUploadMiddleware = ({
    filenameHandler,
    fileFilterHandler,
    fields,
  }: ConfigureUploadMiddlewareArgs): RequestHandler => {
    const storageDirectory = this.configService.getAppConfig().storage.directory;

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const now = new Date();
        const uploadPath = path.join(
          storageDirectory,
          now.getFullYear().toString(),
          String(now.getMonth() + 1).padStart(2, '0'),
        );

        mkdir(uploadPath, { recursive: true }, (err) => {
          if (err) return cb(err, uploadPath);
          cb(null, uploadPath);
        });
      },
      filename: filenameHandler,
    });

    const upload = multer({
      storage,
      limits: { fileSize: 12 * 1024 * 1024 }, // 12MB
      fileFilter: fileFilterHandler,
    });

    const handler = upload.fields(fields);

    return (req, res, next) => {
      handler(req, res, (err) => {
        if (err) return next(err);
        next();
      });
    };
  };

  protected buildRequestValidationError = ({ field, error }: { field: string; error: string }) => {
    return new ZodError([
      {
        path: [field],
        message: error,
        code: 'custom',
      },
    ]);
  };

  public static asyncRequestHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>,
  ): RequestHandler => {
    return async (wrapperReq: Request, wrapperRes: Response, wrapperNext: NextFunction) => {
      try {
        await fn(wrapperReq, wrapperRes, wrapperNext);
      } catch (e) {
        return wrapperNext(e);
      }
    };
  };

  private static resolveZodError = (error: ZodIssue[]) => {
    const resErrors: RequestValidationErrors = {};

    for (const fieldError of error) {
      let fieldName = fieldError.path.join('.');
      if (!fieldName) {
        fieldName = 'unknown';
      }
      if (isNil(resErrors[fieldName])) {
        resErrors[fieldName] = [];
      }
      resErrors[fieldName].push(fieldError.message);
    }

    return resErrors;
  };

  public static globalErrorHandler = (
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    if (error instanceof FileUploadError) {
      const errors: RequestValidationErrors = {
        [error.field]: [error.message],
      };
      return res.status(422).json({ errors });
    }

    if (error instanceof ZodError) {
      return res.status(422).json({ errors: this.resolveZodError(error.issues) });
    }

    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }

    return next(error);
  };
}
