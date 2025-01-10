import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY;
const COOKIE_NAME = "admin_token";

export default function handler(req, res) {
  const token = req.cookies[COOKIE_NAME];

  try {
    jwt.verify(token, SECRET_KEY);
    res.status(200).json({ message: "Session active" });
  } catch (err) {
    res.status(401).json({ message: "Session invalid" });
  }
}
