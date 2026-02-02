import multer from "multer";
import path from "path";

const upload = multer({
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, "..", "/imagens/uploads"),
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  })
});

export default upload