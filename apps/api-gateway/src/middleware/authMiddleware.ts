import { getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";

type AuthenticatedRequest = Request & { userId?: string };

export const verifyUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {

  const auth = getAuth(req);
  const userIdFromAuth = auth?.userId;
  const userIdFromHeader = req.headers["x-user-id"] as string | undefined;
  const userId = userIdFromAuth || userIdFromHeader

  console.log("auth from api-gateways:", {
    userId,
    hasAuthorizationHeader: Boolean(req.headers.authorization),
    authKeys: auth ? Object.keys(auth) : [],
  });

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  req.userId = userId;
  next();
};