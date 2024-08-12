import mysql from "mysql2/promise";

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

  if (req.method === "DELETE") {
    const { id } = req.query;

    if (!id) {
      return res
        .status(400)
        .json({ message: "ID-ul produsului este necesar." });
    }

    try {
      const query = "DELETE FROM produits WHERE id = ?";
      const [result] = await dbconnection.execute(query, [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Produsul nu a fost găsit." });
      }

      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }

  await dbconnection.end();
}
