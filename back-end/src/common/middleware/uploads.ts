import upload from "../../config/multer";
import { Request, Response, NextFunction } from "express";

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

const uploadMiddleware = [
  uploadMaxCountMiddleware,
  validateMainImageMinCount,
];

export { uploadMiddleware };