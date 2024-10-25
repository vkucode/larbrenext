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

      // Încărcăm imaginea pe Cloudinary
      if (files.imagine) {
        try {
          const imageUploadResult = await cloudinary.v2.uploader.upload(
            files.imagine.filepath,
            {
              folder: "larbreapains/img",
            }
          );
          imageUrl = imageUploadResult.secure_url;
        } catch (error) {
          return res.status(500).json({ message: "Image upload failed" });
        }
      }

      // Încărcăm fișa tehnică pe Cloudinary
      if (files.fiche) {
        try {
          const ficheUploadResult = await cloudinary.v2.uploader.upload(
            files.fiche.filepath,
            {
              folder: "larbreapains/fichetech",
              resource_type: "auto", // Setăm tipul fișierului ca "auto" pentru a permite alte tipuri
            }
          );
          ficheUrl = ficheUploadResult.secure_url;
        } catch (error) {
          return res
            .status(500)
            .json({ message: "Technical file upload failed" });
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

        res.status(201).json({ message: "Produs adăugat cu succes" });
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

      // Încărcăm imaginea pe Cloudinary dacă este furnizată
      if (files.imagine) {
        try {
          const imageUploadResult = await cloudinary.v2.uploader.upload(
            files.imagine.filepath,
            {
              folder: "larbreapains/img",
            }
          );
          const imageUrl = imageUploadResult.secure_url;
          query += ", imagine_produs = ?";
          queryParams.push(imageUrl);
        } catch (error) {
          return res.status(500).json({ message: "Image upload failed" });
        }
      }

      // Încărcăm fișierul tehnic pe Cloudinary dacă este furnizat
      // Încărcăm fișa tehnică pe Cloudinary
      if (files.fiche) {
        try {
          // Verificăm dacă fișierul este de tip PDF
          if (files.fiche.mimetype !== "application/pdf") {
            return res
              .status(400)
              .json({
                message: "Doar fișiere PDF sunt permise pentru încărcare.",
              });
          }

          const ficheUploadResult = await cloudinary.v2.uploader.upload(
            files.fiche.filepath,
            {
              folder: "larbreapains/fichetech",
              resource_type: "raw", // Setăm tipul fișierului la "raw" pentru PDF-uri
              format: "pdf", // Asigurăm că formatul rămâne PDF
            }
          );
          ficheUrl = ficheUploadResult.secure_url;
        } catch (error) {
          return res
            .status(500)
            .json({ message: "Încărcarea fișei tehnice a eșuat." });
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
        .json({ message: "ID-ul produsului este necesar." });
    }

    try {
      const query = "DELETE FROM produits WHERE id = ?";
      await dbconnection.execute(query, [id]);
      res.status(200).json({ message: "Produs șters" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    } finally {
      await dbconnection.end();
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
