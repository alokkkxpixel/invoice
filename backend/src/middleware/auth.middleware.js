import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid or expired token" });
  }
};
