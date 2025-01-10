import mysql from "mysql2/promise";

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  console.log("Request Method:", req.method);
  console.log("Request Body:", req.body);
  console.log("Request Query:", req.query);

  const { user, pass } = req.method === "POST" ? req.body : req.query;

  console.log("User received:", user);
  console.log("Password received:", pass);

  if (!user || !pass) {
    return res.status(400).json({ message: "Missing user or password" });
  }

  let dbconnection;
  try {
    dbconnection = await mysql.createConnection({
      host: "localhost",
      database: "larbreapains",
      user: "larbreapains",
      password: "adminVku23#",
    });

    const query = "SELECT id, pass FROM users WHERE user = ?";
    const [results] = await dbconnection.execute(query, [user]);

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const userRecord = results[0];

    if (pass !== userRecord.pass) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({ message: "Authentication successful" });
  } catch (error) {
    console.error("Error during login:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    if (dbconnection) {
      await dbconnection.end();
      console.log("Database connection closed");
    }
  }
}
