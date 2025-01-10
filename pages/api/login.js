import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY; // Asigură-te că această cheie este sigură și unică
const COOKIE_NAME = "admin_token";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const { user, pass } = req.body;

  if (!user || !pass) {
    return res.status(400).json({ message: "Missing user or password" });
  }

  try {
    const dbconnection = await mysql.createConnection({
      host: "localhost",
      database: "larbreapains",
      user: "larbreapains",
      password: "adminVku23#",
    });

    const query = "SELECT id, pass FROM users WHERE user = ?";
    const [results] = await dbconnection.execute(query, [user]);

    if (results.length === 0 || pass !== results[0].pass) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: results[0].id }, SECRET_KEY, {
      expiresIn: "3h",
    });

    res.setHeader(
      "Set-Cookie",
      `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; Max-Age=10800;`
    );
    res.status(200).json({ message: "Authentication successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
