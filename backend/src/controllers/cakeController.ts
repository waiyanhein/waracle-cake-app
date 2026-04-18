import { Service } from "typedi";
import { CakeService } from "../services/domain/cakeService";
import { NextFunction, Request, Response } from "express";
import { isNil } from "lodash";
import { Controller } from "./controller";
import { extname } from 'path';
import { CryptoService } from "../services/core/cryptoService";

@Service()
export class CakeController extends Controller {
    constructor(private readonly cakeService: CakeService, private readonly cryptoService: CryptoService) {
        super();
    }

    /**
     * @notes - middleware local to this controller and should not be used anywhere else
     */
    public uploadImagesMiddleware = (
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        return this.configureUploadMiddleware({
            req,
            res,
            next,
            fields: [
              { name: "imageFiles", maxCount: 5 },
            ],
            filenameHandler: (req, file, cb) => {
                const uniqueName = this.cryptoService.generateUuid();
                const extension = extname(file.originalname);
              
                cb(null, `${uniqueName}${extension}`);
              },
              fileFilterHandler: (req, file, cb) => {
                if (file.fieldname === "imageFiles") {
                //   if (!file.mimetype.startsWith("image/")) {
                //     return cb(new Error("Avatar must be an image"));
                //   }
                // console.log(file);
                // TODO - validate the files.
                }
          
                // if (file.fieldname === "gallery") {
                //   if (!file.mimetype.startsWith("image/")) {
                //     return cb(new Error("Gallery must contain images"));
                //   }
                // }
          
                cb(null, true);
              },
        });
      };

    public createOne = async (req: Request, res: Response) => {
      let imagePaths: string[] = [];
        if (!isNil(req.files) && !Array.isArray(req.files)) {
          imagePaths = req.files.imageFiles.map((f) => f.path);
        }
        await this.cakeService.createOne({
          name: req.body.name,
          comment: req.body.comment,
          yumFactor: req.body.yumFactor,
          imagePaths: imagePaths,
        });

        return res.status(200).json({ message: "Cake created successfully" });
    }

    public findMany = async (req: Request, res: Response) => {
        const cakes = await this.cakeService.findMany();
        return res.status(200).json({ cakes});
    }
}
