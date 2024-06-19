import mysql from "mysql2/promise";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    // Pre-flight request for CORS
    res.status(200).end();
    return;
  }

  try {
    const dbconnection = await mysql.createConnection({
      host: "localhost",
      database: "larbreapains",
      user: "larbreapains",
      password: "KODulFPwugHRiKO",
    });
    console.log("Database connection established");

    const query =
      "SELECT id, tip_produs, categoria_produs, nume_produs, descriere_produs, imagine_produs FROM produits";
    const values = [];
    const [results] = await dbconnection.execute(query, values);
    console.log("Query executed successfully");

    dbconnection.end();
    console.log("Database connection closed");

    res.status(200).json({ products: results });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: error.message });
  }
}
