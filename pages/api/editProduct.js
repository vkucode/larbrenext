import mysql from "mysql2/promise";
import formidable from "formidable";
import { Storage } from "@google-cloud/storage";

// Configurare Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
  credentials: {
    client_email: process.env.GCS_CLIENT_EMAIL,
    private_key: process.env.GCS_SECRET_KEY.replace(/\\n/g, "\n"),
  },
});

const bucketName = process.env.GCS_BUCKET_NAME;

export const config = {
  api: {
    bodyParser: false, // Dezactivăm bodyParser pentru a folosi formidable
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
    const form = new formidable.IncomingForm({ maxFileSize: 10 * 1024 * 1024 }); // Limita mărimii fișierelor la 10MB

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

        // Încărcăm imaginea pe Google Cloud Storage dacă este furnizată
        if (files.imagine) {
          const filePath = files.imagine.filepath;
          const contentType = files.imagine.mimetype;
          const fileName = `img/${Date.now()}_${
            files.imagine.originalFilename
          }`;
          imageUrl = await uploadToGCS(filePath, fileName, contentType);
        }

        // Încărcăm fișierul tehnic pe Google Cloud Storage dacă este furnizat
        if (files.fiche) {
          const filePath = files.fiche.filepath;
          const contentType = files.fiche.mimetype;
          const fileName = `fichetech/${Date.now()}_${
            files.fiche.originalFilename
          }`;
          ficheUrl = await uploadToGCS(filePath, fileName, contentType);
        }

        // Construim interogarea SQL și parametrii
        let query = `
          UPDATE produits 
          SET 
            nume_produs_ar = ?, 
            nume_produs_en = ?, 
            nume_produs = ?, 
            descriere_produs_ar = ?, 
            descriere_produs_en = ?, 
            descriere_produs = ?, 
            tip_produs = ?, 
            categoria_produs = ?`;
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

// Funcție pentru încărcarea fișierelor pe Google Cloud Storage
async function uploadToGCS(filePath, fileName, contentType) {
  try {
    await storage.bucket(bucketName).upload(filePath, {
      destination: fileName,
      metadata: {
        contentType,
        cacheControl: "public, max-age=31536000",
      },
    });
    return `https://storage.googleapis.com/${bucketName}/${fileName}`;
  } catch (error) {
    console.error("File upload error to GCS:", error.message);
    throw new Error("File upload error to GCS");
  }
}
