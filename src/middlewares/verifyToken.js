import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  let accessToken = req.headers.authorization?.split(" ")[1];
  if (!accessToken) {
    return res.status(401).json({
      err: 1,
      msg: "Missing access token !",
    });
  }

  jwt.verify(accessToken, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(401).json({
        err: 1,
        msg: "Access token expired !",
      });
    }
    req.user = user;
    next();
  });
};

export const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      err: 1,
      msg: "Access denied. Admins only!",
    });
  }
  next();
};

export default verifyToken;
