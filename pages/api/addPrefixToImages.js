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
    "GET, POST, OPTIONS, PUT, DELETE, PATCH"
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
    // Codul existent pentru metoda POST...
  } else if (req.method === "GET") {
    // Codul existent pentru metoda GET...
  } else if (req.method === "PUT") {
    // Codul existent pentru metoda PUT...
  } else if (req.method === "DELETE") {
    // Codul existent pentru metoda DELETE...
  } else if (req.method === "PATCH") {
    try {
      const prefix = "https://www.larbreapains.fr/img/imgProducts/";

      // Obținem toate produsele care au un URL de imagine fără prefix
      const [produse] = await dbconnection.execute(
        "SELECT id, imagine_produs FROM produits WHERE imagine_produs IS NOT NULL"
      );

      // Actualizăm fiecare produs, adăugând prefixul la imagine
      for (const produs of produse) {
        const { id, imagine_produs } = produs;

        // Adăugăm prefixul doar dacă URL-ul nu conține deja prefixul
        if (!imagine_produs.startsWith(prefix)) {
          const newImageUrl = prefix + imagine_produs;

          // Actualizăm URL-ul imaginii în baza de date
          await dbconnection.execute(
            "UPDATE produits SET imagine_produs = ? WHERE id = ?",
            [newImageUrl, id]
          );
        }
      }

      res
        .status(200)
        .json({ message: "Prefixul a fost adăugat la toate imaginile." });
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
