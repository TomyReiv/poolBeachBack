import { Request, Response } from "express";
import { httpResponse } from "../utils/enumsError";

const HttpResponse = new httpResponse();

export const handleGoogleCallback = (req: Request, res: Response) => {
  try {
    // Aquí tienes al usuario autenticado en `req.user`
    return HttpResponse.OK(res, req.user);
  } catch (error) {
    return HttpResponse.Error(res, (error as Error).message);
  }
};
