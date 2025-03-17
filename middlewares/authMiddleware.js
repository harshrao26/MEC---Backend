const jwt = require("jsonwebtoken");
module.exports.authMiddleware = async (req, res, next) => {
  const { token } = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({ error: "Please Login First" });
  } else {
    try {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      req.role = decoded.role;
        req.id = decoded.id;
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ error: "Please Login First" });
    }
  }
};
