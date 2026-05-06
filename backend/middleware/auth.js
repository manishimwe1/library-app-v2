import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.SECRETE_KEY;

export const authenticationToken = (req, res, next) => {
  const authHeaders = req.headers["Authorization"];
  const token = authHeaders && authHeaders.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access denied no token provided" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
  }
};

export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, username: user.username },
    JWT_SECRET,
    { expiresIn: "24h" },
  );
};
