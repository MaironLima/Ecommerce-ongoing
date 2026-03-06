import upload from "../../config/multer";
import { Request, Response, NextFunction } from "express";
import sharp from "sharp";
import path from "path";

const uploadMaxCountMiddleware = upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "extraImages", maxCount: 10 },
]);

function validateMainImageMinCount(req: Request, res: Response, next: NextFunction) {
  if (!req.files || !("mainImage" in req.files) || !(req.files as any).mainImage.length) {
    return res.status(400).json({ error: "mainImage is mandatory" });
  }
  next();
}


async function processImagesWithSharp(req: Request, res: Response, next: NextFunction) {
  try {
    // mainImage
    if (req.files && !Array.isArray(req.files) && req.files.mainImage && req.files.mainImage[0]) {
      const imageBuffer = (req.files.mainImage[0] as Express.Multer.File).buffer;
      const originalName = req.files.mainImage[0].originalname;
      const webpName = path.parse(originalName).name + ".webp";
      const uploadPath = path.resolve(__dirname, "../../imagens/uploads", webpName);
      await sharp(imageBuffer)
        .resize(800, 800)
        .webp()
        .toFile(uploadPath);
      req.body.mainImageWebp = webpName;
    }

    // extraImages
    if (req.files && !Array.isArray(req.files) && req.files.extraImages && Array.isArray(req.files.extraImages)) {
      req.body.extraImagesWebp = [];
      for (const file of req.files.extraImages as Express.Multer.File[]) {
        const extraBuffer = file.buffer;
        const originalName = file.originalname;
        const webpName = path.parse(originalName).name + ".webp";
        const extraUploadPath = path.resolve(__dirname, "../../imagens/uploads", webpName);
        await sharp(extraBuffer)
          .resize(800, 800)
          .webp()
          .toFile(extraUploadPath);
        req.body.extraImagesWebp.push(webpName);
      }
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: "Error processing image" });
  }
}


const uploadMiddleware = [
  uploadMaxCountMiddleware,
  validateMainImageMinCount,
  processImagesWithSharp,
];

const uploadMiddlewareNotMandatory = [
  uploadMaxCountMiddleware,
  processImagesWithSharp,
];

export { uploadMiddleware, uploadMiddlewareNotMandatory };