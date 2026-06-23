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
console.log("middleware from order service file",userId)
  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  req.userId = userId as string;

  next();
};