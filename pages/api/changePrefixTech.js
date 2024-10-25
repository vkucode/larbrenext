import mysql from "mysql2/promise";

// Configurare conexiune la baza de date
const dbconnection = mysql.createPool({
  host: "localhost",
  database: "larbreapains",
  user: "larbreapains",
  password: "adminVku23#",
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE, PATCH"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "PATCH") {
    try {
      const prefix = "https://www.larbreapains.fr/ficheTechnique/";

      // Obținem toate produsele care au o fișă tehnică
      const [produse] = await dbconnection.execute(
        "SELECT id, fiche_tech FROM produits WHERE fiche_tech IS NOT NULL"
      );

      // Actualizăm fiecare fișă tehnică, adăugând prefixul dacă nu există deja
      for (const produs of produse) {
        const { id, fiche_tech } = produs;

        // Adăugăm prefixul doar dacă URL-ul nu conține deja prefixul
        if (!fiche_tech.startsWith(prefix)) {
          const newFicheUrl = prefix + fiche_tech;

          // Actualizăm URL-ul fișei tehnice în baza de date
          await dbconnection.execute(
            "UPDATE produits SET fiche_tech = ? WHERE id = ?",
            [newFicheUrl, id]
          );
        }
      }

      res
        .status(200)
        .json({ message: "Prefixul a fost adăugat la toate fișele tehnice." });
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
