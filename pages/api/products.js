import mysql from "mysql2/promise";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
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
    const form = new formidable.IncomingForm();
    form.uploadDir = "/img/imgProducts/";
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      const { nume_ar, nume, descriere_ar, descriere, tip, categorie } = fields;
      const imagine = files.imagine ? path.basename(files.imagine.path) : null;

      if (
        !nume_ar ||
        !nume ||
        !descriere_ar ||
        !descriere ||
        !tip ||
        !categorie ||
        !imagine
      ) {
        return res
          .status(400)
          .json({ message: "Toate câmpurile trebuie completate." });
      }

      try {
        const query =
          "INSERT INTO produits (nume_produs_ar, nume_produs, descriere_produs_ar, descriere_produs, tip_produs, categoria_produs, imagine_produs) VALUES (?, ?, ?, ?, ?, ?, ?)";
        await dbconnection.execute(query, [
          nume_ar,
          nume,
          descriere_ar,
          descriere,
          tip,
          categorie,
          imagine,
        ]);
        res.status(201).json({ message: "Product added" });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });
  } else if (req.method === "PUT") {
    const form = new formidable.IncomingForm();
    form.uploadDir = "/img/imgProducts/";
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      const { id, nume_ar, nume, descriere_ar, descriere, tip, categorie } =
        fields;
      const imagine = files.imagine ? path.basename(files.imagine.path) : null;

      if (
        !id ||
        !nume_ar ||
        !nume ||
        !descriere_ar ||
        !descriere ||
        !tip ||
        !categorie
      ) {
        return res
          .status(400)
          .json({ message: "Toate câmpurile trebuie completate." });
      }

      try {
        const query =
          "UPDATE produits SET nume_produs_ar = ?, nume_produs = ?, descriere_produs_ar = ?, descriere_produs = ?, tip_produs = ?, categoria_produs = ?, imagine_produs = ? WHERE id = ?";
        await dbconnection.execute(query, [
          nume_ar,
          nume,
          descriere_ar,
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
    });
  } else if (req.method === "DELETE") {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      const { id } = fields;

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
    });
  }

  await dbconnection.end();
}
