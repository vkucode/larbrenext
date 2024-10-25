import mysql from "mysql2/promise";
import cloudinary from "cloudinary";

// Configurare Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: true,
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
    const { id } = req.query;
    if (!id) {
      return res
        .status(400)
        .json({ message: "ID-ul produsului este necesar." });
    }

    try {
      const query = "SELECT * FROM produits WHERE id = ?";
      const [results] = await dbconnection.execute(query, [id]);
      if (results.length === 0) {
        return res.status(404).json({ message: "Produsul nu a fost găsit." });
      }
      res.status(200).json({ product: results[0] });
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
      imagine, // Fișierul de imagine
      fiche, // Fișierul tehnic
    } = req.body;

    if (
      !id ||
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
      // Încărcăm imaginea pe Cloudinary în dosarul specificat
      const imageUploadResult = await cloudinary.v2.uploader.upload(imagine, {
        folder: "larbreapains/img", // Dosarul pentru imagini
      });

      // URL-ul imaginii încărcate pe Cloudinary
      const imageUrl = imageUploadResult.secure_url;

      // Încărcăm fișierul tehnic pe Cloudinary în dosarul specificat
      const ficheUploadResult = await cloudinary.v2.uploader.upload(fiche, {
        folder: "larbreapains/fichetech", // Dosarul pentru fișierele tehnice
        resource_type: "raw", // Setăm tipul fișierului ca "raw" pentru a permite încărcarea altor tipuri decât imagini
      });

      // URL-ul fișierului tehnic încărcat pe Cloudinary
      const ficheUrl = ficheUploadResult.secure_url;

      // Actualizăm baza de date cu URL-urile imaginii și fișierului tehnic
      const query =
        "UPDATE produits SET nume_produs_ar = ?, nume_produs_en = ?, nume_produs = ?, descriere_produs_ar = ?, descriere_produs_en = ?, descriere_produs = ?, tip_produs = ?, categoria_produs = ?, imagine_produs = ?, fiche_tech = ? WHERE id = ?";
      await dbconnection.execute(query, [
        nume_ar,
        nume_en,
        nume,
        descriere_ar,
        descriere_en,
        descriere,
        tip,
        categorie,
        imageUrl, // URL-ul imaginii de pe Cloudinary
        ficheUrl, // URL-ul fișierului tehnic de pe Cloudinary
        id,
      ]);
      res.status(200).json({ message: "Produs actualizat" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  await dbconnection.end();
}
