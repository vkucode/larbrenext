import mysql from "mysql2/promise";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Permitem doar metodele GET
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Conexiunea la baza de date
    const dbconnection = await mysql.createConnection({
      host: "127.0.0.1",
      database: "larbreapains",
      user: "larbreapains",
      password: "adminVku23#",
    });

    // Obținem utilizatorii din tabel
    const query = "SELECT id, user FROM users"; // Nu includem parola pentru securitate
    const [results] = await dbconnection.execute(query);

    // Închidem conexiunea
    await dbconnection.end();

    // Returnăm utilizatorii ca răspuns
    res.status(200).json({ users: results });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Database connection error", error: error.message });
  }
}
