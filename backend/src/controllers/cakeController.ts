import { Service } from "typedi";
import { CakeService } from "../services/domain/cakeService";
import { Request, Response } from "express";
import { isNil } from "lodash";
import { Controller } from "./controller";
import { extname } from "path";
import { CryptoService } from "../services/core/cryptoService";
import { z } from "zod";
import { FileUploadError } from "../errors/fileUploadError";
import { toCakeResDto } from "../resDtos/cakeResDto";

const createCakeReqDtoSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { message: "Name is required" })
      .max(30, { message: "Name must be max 30 characters" }),
    comment: z
      .string()
      .trim()
      .min(1, { message: "Comment is required" })
      .max(200, { message: "Comment must be max 200 characters" }),
    yumFactor: z.preprocess(
      (val) => {
        if (typeof val === "string") {
          return Number(val.trim());
        }
        return val;
      },
      z
        .number()
        .min(1, { message: "Yum factor is required" })
        .max(10, { message: "Yum factor must be max 10" }),
    ),
  })
  .strict();

@Service()
export class CakeController extends Controller {
  constructor(
    private readonly cakeService: CakeService,
    private readonly cryptoService: CryptoService,
  ) {
    super();
  }

  public uploadImagesMiddleware = this.configureUploadMiddleware({
    fields: [{ name: "imageFiles", maxCount: 5 }],
    filenameHandler: (req, file, cb) => {
      const uniqueName = this.cryptoService.generateUuid();
      const extension = extname(file.originalname);
      cb(null, `${uniqueName}${extension}`);
    },
    fileFilterHandler: (req, file, cb) => {
      if (!file.mimetype.startsWith("image/")) {
        return cb(
          new FileUploadError({
            field: "imageFiles",
            error: "Files must be images",
          }),
        );
      }
      cb(null, true);
    },
  });

  public createOne = async (req: Request, res: Response) => {
    let imagePaths: string[] = [];
    if (!isNil(req.files) && !Array.isArray(req.files)) {
      imagePaths = req.files.imageFiles.map((f) => f.path);
    }
    const reqDto = createCakeReqDtoSchema.parse(req.body);
    await this.cakeService.createOne({
      name: reqDto.name,
      comment: reqDto.comment,
      yumFactor: reqDto.yumFactor,
      imagePaths: imagePaths,
    });

    return res.status(201).json({ message: "Cake created successfully" });
  };

  public findMany = async (req: Request, res: Response) => {
    const page = Number(req.query.page ?? 1);
    const recordsPerPage = Number(req.query.recordsPerPage ?? 20);
    const paginatedResult = await this.cakeService.findMany({
      page,
      recordsPerPage,
    });
    return res.status(200).json({
      ...paginatedResult,
      data: paginatedResult.data.map(toCakeResDto),
    });
  };
}
