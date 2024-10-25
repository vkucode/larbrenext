import mysql from "mysql2/promise";
import cloudinary from "cloudinary";
import formidable from "formidable";

// Configurare Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false, // Dezactivează bodyParser-ul Next.js pentru a putea folosi formidable
  },
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Permite accesul din orice origine
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
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ message: "Eroare la procesarea fișierelor." });
        return;
      }

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
      } = fields;

      if (
        !id ||
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
        let imageUrl = null;
        let ficheUrl = null;

        // Încărcăm imaginea pe Cloudinary dacă este furnizată
        if (files.imagine) {
          const imageUploadResult = await cloudinary.v2.uploader.upload(
            files.imagine.filepath,
            { folder: "larbreapains/img" }
          );
          imageUrl = imageUploadResult.secure_url;
        }

        // Încărcăm fișierul tehnic pe Cloudinary dacă este furnizat
        if (files.fiche) {
          const ficheUploadResult = await cloudinary.v2.uploader.upload(
            files.fiche.filepath,
            { folder: "larbreapains/fichetech", resource_type: "raw" }
          );
          ficheUrl = ficheUploadResult.secure_url;
        }

        // Construim interogarea SQL și parametrii
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

        if (imageUrl) {
          query += ", imagine_produs = ?";
          queryParams.push(imageUrl);
        }

        if (ficheUrl) {
          query += ", fiche_tech = ?";
          queryParams.push(ficheUrl);
        }

        query += " WHERE id = ?";
        queryParams.push(id);

        // Executăm interogarea de actualizare
        await dbconnection.execute(query, queryParams);
        res.status(200).json({ message: "Produs actualizat" });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });
  }

  await dbconnection.end();
}
