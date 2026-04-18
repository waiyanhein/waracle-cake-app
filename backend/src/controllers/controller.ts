import { NextFunction, Request, Response, RequestHandler } from "express";
import multer from "multer";
import { appConfig } from "../appConfig";
import path from "path";
import { mkdir } from "fs";

type ConfigureUploadMiddlewareArgs = {req: Request, res: Response, next: NextFunction, 
    fields: multer.Field[],
    filenameHandler: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
) => void, fileFilterHandler?: (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => void}

export class Controller {
    protected failRequestValidation = (error: string) => {
        throw new Error(error);
    }

    /**
     * @notes - getting rid of the callback style would overcomplicate the code as the multer library expects a callback style.
     */
    protected configureUploadMiddleware = ({req, res, next, filenameHandler, fileFilterHandler, fields}: ConfigureUploadMiddlewareArgs): RequestHandler => {
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, "0");
              
                const uploadPath = path.join(
                  appConfig.storage.directory,
                  year.toString(),
                  month
                );
              
                // ✅ async, but callback style (this is what Multer expects)
                mkdir(uploadPath, { recursive: true }, (err) => {
                  if (err) return cb(err, uploadPath);
              
                  cb(null, uploadPath);
                });
              },
              
              filename: filenameHandler,
          });
        const upload = multer({
          storage,
          limits: {
            fileSize: 12 * 1024 * 1024, // 12MB
          },
          fileFilter: fileFilterHandler,
        });
      
        const handler = upload.fields(fields);
      
        handler(req, res, (err) => {
          if (err) {
            return res.status(400).json({
              message: err.message || "Upload error",
            });
          }
      
          next();
        });

        return handler;
    }
}