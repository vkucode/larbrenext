import mysql from "mysql2/promise";

export default async function handler(req, res) {
  const dbconnection = await mysql.createConnection({
    host: "localhost",
    database: "larbreapains",
    user: "larbreapains",
    password: "adminVku23#",
  });

  if (req.method === "GET") {
    try {
      const query = "SELECT * FROM produits";
      const [results] = await dbconnection.execute(query);
      res.status(200).json({ products: results });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else if (req.method === "POST") {
    const { nume, descriere, tip, categorie, imagine } = req.body;

    try {
      const query =
        "INSERT INTO produits (nume_produs, descriere_produs, tip_produs, categoria_produs, imagine_produs) VALUES (?, ?, ?, ?, ?)";
      await dbconnection.execute(query, [
        nume,
        descriere,
        tip,
        categorie,
        imagine,
      ]);
      res.status(201).json({ message: "Product added" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else if (req.method === "PUT") {
    const { id, nume, descriere, tip, categorie, imagine } = req.body;

    try {
      const query =
        "UPDATE produits SET nume_produs = ?, descriere_produs = ?, tip_produs = ?, categoria_produs = ?, imagine_produs = ? WHERE id = ?";
      await dbconnection.execute(query, [
        nume,
        descriere,
        tip,
        categorie,
        imagine,
        id,
      ]);
      res.status(200).json({ message: "Product updated" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.body;

    try {
      const query = "DELETE FROM produits WHERE id = ?";
      await dbconnection.execute(query, [id]);
      res.status(200).json({ message: "Product deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  await dbconnection.end();
}
