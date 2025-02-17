import dotenv from "dotenv";
dotenv.config();

export const port: any | undefined = process.env.PORT || 8080;
export const db: string = process.env.DB || "";
export const jwtKey: string = process.env.JWT_KEY || "";
export const secretKey: string = process.env.JWT_SECRET || "";
export const secret: string = process.env.SECRET || "";
export const CLOUDINARY_NAME: string = process.env.CLOUDINARY_NAME || "";
export const CLOUDINARY_API_KEY: string = process.env.CLOUDINARY_API_KEY || "";
export const CLOUDINARY_API_SECRET: string = process.env.CLOUDINARY_API_SECRET || "";

export const googleClientId: string = process.env.GOOGLE_CLIENT_ID || "";
export const googleClientSecret: string = process.env.GOOGLE_CLIENT_SECRET || "";
export const googleCallbackUrl: string = process.env.GOOGLE_CALLBACK_URL || "";

export const STRIPE_SECRET_KEY: string = process.env.STRIPE_SECRET_KEY || "";
export const stripeWebhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET || "";

export const URL: string = process.env.URL || "";
export const URL_BACK: string = process.env.URL_BACK || "";
export const URL_ORIGEN: string = process.env.URL_ORIGEN || "";

export const GMAIL_USER: string = process.env.GMAIL_USER || "";
export const GMAIL_PASS: string = process.env.GMAIL_PASS || "";