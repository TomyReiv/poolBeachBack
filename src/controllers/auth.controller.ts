import { Request, Response } from "express";
import { jwtKey, URL } from "../utils/constant";
import jwt from "jsonwebtoken";
/* import { httpResponse } from "../utils/enumsError"; */

/* const HttpResponse = new httpResponse(); */

export const handleGoogleCallback = (req: Request, res: Response) => {
  try {
    // Aquí tienes al usuario autenticado en `req.user`
    const user = req.user as any; // Asegúrate de que `req.user` tiene los datos esperados
    const token = jwt.sign({ id: user._id }, jwtKey as string);
    if (!user) {
      return res.redirect(`${URL}/Home`); // Redirige a una página de error si no hay usuario
    }
    res.cookie(jwtKey as string, token, {
      maxAge: 1000 * 60 * 60, // 1 hora
      httpOnly: false,
      sameSite: "strict",
      secure: true,
    });
    // Construir URL de redirección con el token (puede ser a tu frontend)
    const redirectUrl = `${URL}/Reserva`;

    return res.redirect(redirectUrl);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};
export const checkAuth = (req: Request, res: Response) => {
  try {
    const token = req.cookies.authToken;
    if (token) {
      return res.json({ authenticated: true });
    }
    return res.json({ authenticated: false });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};
