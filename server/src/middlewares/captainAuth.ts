import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

export interface CaptainAuthRequest extends Request {
  captain?: {
    captainId: string;
    email: string;
    department: string;
    role: string;
  };
}

export const captainAuthMiddleware = (
  req: CaptainAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as {
      captainId: string;
      email: string;
      department: string;
      role: string;
    };

    if (decoded.role !== "captain") {
      return res.status(403).json({ error: "Access denied. Captain only." });
    }

    req.captain = decoded;
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
};
