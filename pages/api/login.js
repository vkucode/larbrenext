import mysql from "mysql2/promise";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Permitem doar metodele POST
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { user, pass } = req.body;

  console.log("User received:", user);
  console.log("Password received:", pass);

  // Verificăm dacă user sau parola lipsesc
  if (!user || !pass) {
    return res.status(400).json({ message: "Missing user or password" });
  }

  let dbconnection;
  try {
    // Conectare la baza de date
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

    // Verificare parolă
    if (pass !== userRecord.pass) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Răspuns de succes fără creare de sesiune
    return res.status(200).json({ message: "Authentication successful" });
  } catch (error) {
    console.error("Error during login:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    if (dbconnection) {
      await dbconnection.end(); // Închidem conexiunea MySQL
    }
  }
}
