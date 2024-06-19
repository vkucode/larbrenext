import mysql from "mysql2/promise";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    console.log("Attempting to connect to the database...");
    const dbconnection = await mysql.createConnection({
      host: "https://phpmyadmin.web-1.anybug.fr/",
      database: "larbreapains",
      user: "larbreapains",
      password: "KODulFPwugHRiKO",
    });
    console.log("Database connection established");

    const query =
      "SELECT id, tip_produs, categoria_produs, nume_produs, descriere_produs, imagine_produs FROM produits";
    const values = [];
    console.log("Executing query:", query);
    const [results] = await dbconnection.execute(query, values);
    console.log("Query executed successfully, results:", results);

    dbconnection.end();
    console.log("Database connection closed");

    res.status(200).json({ products: results });
  } catch (error) {
    if (error instanceof mysql.SqlError) {
      console.error("SQL error occurred:", error.message);
    } else if (error instanceof mysql.ConnectionError) {
      console.error("Connection error occurred:", error.message);
    } else {
      console.error("Unknown error occurred:", error.message);
    }
    res.status(500).json({ error: error.message || "Unknown error" });
  }
}
