const prisma = require("../libs/prisma");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

module.exports = {
  restrict: (req, res, next) => {
    let { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized",
        err: "missing token on header!",
        data: null,
      });
    }

    authorization = authorization.replace("Bearer ", "");

    jwt.verify(authorization, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          status: false,
          message: "Unauthorized",
          err: err.message,
          data: null,
        });
      }

      req.user = await prisma.users.findUnique({ where: { id: decoded.id } });
      next();
    });
  },
};
