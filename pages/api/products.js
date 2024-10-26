import mysql from "mysql2/promise";
import formidable from "formidable";
import { Storage } from "@google-cloud/storage";
import path from "path";

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
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE, PATCH"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const dbconnection = await mysql.createConnection({
    host: "127.0.0.1",
    database: "larbreapains",
    user: "larbreapains",
    password: "adminVku23#",
  });

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "POST") {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Form parsing error:", err);
        return res.status(500).json({ message: "Form parsing error" });
      }

      const {
        nume_ar,
        nume_en,
        nume,
        descriere_ar,
        descriere_en,
        descriere,
        tip,
        categorie,
      } = fields;

      let imageUrl = null;
      let ficheUrl = null;

      // Încărcăm imaginea pe Google Cloud Storage
      if (files.imagine) {
        try {
          const filePath = files.imagine.filepath;
          const imageUploadResult = await uploadToGCS(filePath, "img");
          imageUrl = imageUploadResult;
        } catch (error) {
          console.error("Image upload error:", error);
          return res.status(500).json({ message: "Image upload failed" });
        }
      }

      // Încărcăm PDF-ul ca un fișier complet, fără modificări
      if (files.fiche) {
        try {
          if (files.fiche.mimetype !== "application/pdf") {
            return res.status(400).json({
              message: "Seuls les fichiers PDF peuvent être téléchargés.",
            });
          }
          const filePath = files.fiche.filepath;
          ficheUrl = await uploadToGCS(filePath, "fichetech");
        } catch (error) {
          console.error("Fiche upload error:", error);
          return res
            .status(500)
            .json({ message: "Échec du chargement de la fiche technique." });
        }
      }

      try {
        // Salvăm datele în baza de date
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
          imageUrl,
          ficheUrl,
        ]);
        res
          .status(201)
          .json({ message: "Produit ajouté avec succès", ficheUrl });
      } catch (error) {
        console.error("Database insertion error:", error);
        res.status(500).json({ message: "Database insertion error" });
      } finally {
        await dbconnection.end();
      }
    });
  } else if (req.method === "GET") {
    try {
      const query = "SELECT * FROM produits";
      const [results] = await dbconnection.execute(query);
      res.status(200).json({ products: results });
    } catch (error) {
      console.error("Database retrieval error:", error);
      res.status(500).json({ message: "Database retrieval error" });
    } finally {
      await dbconnection.end();
    }
  }
}

// Funcție pentru încărcarea fișierelor pe Google Cloud Storage
async function uploadToGCS(filePath, folder) {
  const fileName = `${folder}/${Date.now()}_${path.basename(filePath)}`;
  try {
    await storage.bucket(bucketName).upload(filePath, {
      destination: fileName,
      public: true,
      metadata: { cacheControl: "public, max-age=31536000" },
    });
    const file = storage.bucket(bucketName).file(fileName);
    return `https://storage.googleapis.com/${bucketName}/${fileName}`;
  } catch (error) {
    console.error("File upload error to GCS:", error.message);
    console.error("Details:", error);
    throw new Error("File upload error to GCS");
  }
}
