import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export const shouldBeUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const bearerToken = typeof authHeader === "string"
    ? authHeader.replace(/^Bearer\s+/i, "")
    : undefined;

  console.log("authorization header:", authHeader);
  console.log("bearer token:", bearerToken);

  const auth = getAuth(req);
  console.log("Clerk auth object:", auth);

  const userId = auth?.userId;

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized from order service",
    });
  }

  req.userId = userId as string;

  next();
};