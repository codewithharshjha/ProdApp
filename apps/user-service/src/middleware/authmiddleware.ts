import { getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";

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
  const userId = req.headers["x-user-id"];
console.log("middleware from user service file",userId)
  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  req.userId = userId as string;

  next();
};

export const shouldBeAdmin = (req: Request, res: Response, next: NextFunction) => {
  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) {
    return res.status(401).json({
      message: "You are not logged in. Send Clerk session token: Authorization: Bearer <token>",
    });
  }
  req.userId = userId;
  next();
};
