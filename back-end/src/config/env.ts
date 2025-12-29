import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT;
export const JWT_SECRET = process.env.JWT_SECRET;
export const DATABASE_URL = process.env.DATABASE_URL;
export const REFRESH_SECRET = process.env.DATABASE_URL;
export const MAIL_USER = process.env.MAIL_USER;
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD;
