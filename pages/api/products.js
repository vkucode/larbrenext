import mysql from "mysql2/promise";
import formidable from "formidable";
import { Storage } from "@google-cloud/storage";
import path from "path";

// Configurare Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
  credentials: {
    client_email: process.env.GCS_CLIENT_EMAIL,
    private_key: process.env.GCS_SECRET_KEY.replace(/\\n/g, "\n"), // înlocuiește \\n cu newline real
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
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "POST") {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
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
        res.status(500).json({ message: error.message });
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
      res.status(500).json({ message: error.message });
    } finally {
      await dbconnection.end();
    }
  } else if (req.method === "PUT") {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ message: "Form parsing error" });
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

      if (files.imagine) {
        try {
          const imageUploadResult = await uploadToGCS(
            files.imagine.filepath,
            "img"
          );
          query += ", imagine_produs = ?";
          queryParams.push(imageUploadResult);
        } catch (error) {
          return res.status(500).json({ message: "Image upload failed" });
        }
      }

      if (files.fiche) {
        try {
          if (files.fiche.mimetype !== "application/pdf") {
            return res.status(400).json({
              message: "Seuls les fichiers PDF peuvent être téléchargés.",
            });
          }
          const ficheUploadResult = await uploadToGCS(
            files.fiche.filepath,
            "fichetech"
          );
          query += ", fiche_tech = ?";
          queryParams.push(ficheUploadResult);
        } catch (error) {
          return res
            .status(500)
            .json({ message: "Échec du chargement de la fiche technique." });
        }
      }

      query += " WHERE id = ?";
      queryParams.push(id);

      try {
        await dbconnection.execute(query, queryParams);
        res.status(200).json({ message: "Produs actualizat" });
      } catch (error) {
        res.status(500).json({ message: error.message });
      } finally {
        await dbconnection.end();
      }
    });
  } else if (req.method === "DELETE") {
    const { id } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ message: "ID-ul produsului est nécessaire." });
    }

    try {
      const query = "DELETE FROM produits WHERE id = ?";
      await dbconnection.execute(query, [id]);
      res.status(200).json({ message: "Produit supprimé" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    } finally {
      await dbconnection.end();
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE", "PATCH"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Funcție pentru încărcarea fișierelor pe Google Cloud Storage
async function uploadToGCS(filePath, folder) {
  const fileName = `${folder}/${Date.now()}_${path.basename(filePath)}`;
  await storage.bucket(bucketName).upload(filePath, {
    destination: fileName,
    public: true, // Setăm fișierul ca fiind public
    metadata: {
      cacheControl: "public, max-age=31536000",
    },
  });
  const file = storage.bucket(bucketName).file(fileName);
  return `https://storage.googleapis.com/${bucketName}/${fileName}`; // URL public direct
}
