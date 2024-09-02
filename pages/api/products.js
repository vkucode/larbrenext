import mysql from "mysql2/promise";

export const config = {
  api: {
    bodyParser: true, // Permite utilizarea bodyParser pentru datele JSON
  },
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const dbconnection = await mysql.createConnection({
    host: "localhost",
    database: "larbreapains",
    user: "larbreapains",
    password: "adminVku23#",
  });

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "GET") {
    try {
      const query = "SELECT * FROM produits";
      const [results] = await dbconnection.execute(query);
      res.status(200).json({ products: results });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else if (req.method === "POST") {
    const {
      nume_ar,
      nume_en,
      nume,
      descriere_ar,
      descriere_en,
      descriere,
      tip,
      categorie,
      imagine,
      fiche,
    } = req.body;

    if (
      !nume_ar ||
      !nume_en ||
      !nume ||
      !descriere_ar ||
      !descriere_en ||
      !descriere ||
      !tip ||
      !categorie ||
      !imagine ||
      !fiche
    ) {
      return res
        .status(400)
        .json({ message: "Toate câmpurile trebuie completate." });
    }

    try {
      const query =
        "INSERT INTO produits (nume_produs_ar, nume_produs_en, nume_produs, descriere_produs_ar, descriere_produs_en, descriere_produs, tip_produs, categoria_produs, imagine_produs, fiche_tech) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      await dbconnection.execute(query, [
        nume_ar,
        nume_en,
        nume,
        descriere_ar,
        descriere_en,
        descriere,
        tip,
        categorie,
        imagine,
        fiche,
      ]);
      res.status(201).json({ message: "Product added" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else if (req.method === "PUT") {
    const {
      id,
      nume_ar,
      nume_en,
      nume,
      descriere_ar,
      descriere_en,
      descriere,
      tip,
      categorie,
      imagine,
      fiche,
    } = req.body;

    if (
      !nume_ar ||
      !nume_en ||
      !nume ||
      !descriere_ar ||
      !descriere_en ||
      !descriere ||
      !tip ||
      !categorie
    ) {
      return res
        .status(400)
        .json({ message: "Toate câmpurile trebuie completate." });
    }

    try {
      let query =
        "UPDATE produits SET nume_produs_ar = ?, nume_produs_en = ?, nume_produs = ?, descriere_produs_ar = ?, descriere_produs_en = ?, descriere_produs = ?, tip_produs = ?, categoria_produs = ?";
      let queryParams = [
        nume_ar,
        nume_en,
        nume,
        descriere_ar,
        descriere_en,
        descriere,
        tip,
        categorie,
      ];

      if (imagine !== null) {
        query += ", imagine_produs = ?";
        queryParams.push(imagine);
      }

      if (fiche !== null) {
        query += ", fiche_tech = ?";
        queryParams.push(fiche);
      }

      query += " WHERE id = ?";
      queryParams.push(id);

      await dbconnection.execute(query, queryParams);
      res.status(200).json({ message: "Product updated" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ message: "ID-ul produsului este necesar." });
    }

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
