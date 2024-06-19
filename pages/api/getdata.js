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

    const query =
      "SELECT id, tip_produs, categoria_produs, nume_produs, descriere_produs, imagine_produs FROM produits";
    const values = [];
    const [results] = await dbconnection.execute(query, values);

    dbconnection.end();

    res.status(200).json({ products: results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
