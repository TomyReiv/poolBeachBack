import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: any; // Guardará los datos del usuario después de verificar el token
}

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // 1️⃣ Leer la cookie con el token
    const token = req.cookies[process.env.JWT_SECRET as string]; // La cookie tiene el token
    
    
    if (!token) {
      return res.status(401).json({ message: "Acceso denegado. No hay token en la cookie." });
    }

    // 2️⃣ Verificar el token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; rol: string };
    // 3️⃣ Verificar si el usuario es administrador
    if (decoded.rol !== "Admin") {
      return res.status(403).json({ message: "Acceso denegado. Se requiere rol de administrador." });
    }

    // 4️⃣ Guardar datos del usuario en la request y continuar
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado." });
  }
};
