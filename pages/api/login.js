export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { user, pass } = req.body;

      // Preluăm datele din .env
      const USER_ADMIN = process.env.USER_ADMIN;
      const PASS_ADMIN = process.env.PASS_ADMIN;

      if (!USER_ADMIN || !PASS_ADMIN) {
        console.error("Missing environment variables");
        return res
          .status(500)
          .json({ success: false, message: "Server configuration error" });
      }

      // Verificăm autentificarea
      if (user === USER_ADMIN && pass === PASS_ADMIN) {
        return res.status(200).json({ success: true });
      }

      // Returnăm eroare dacă autentificarea eșuează
      return res
        .status(401)
        .json({ success: false, message: "Invalid login or password" });
    } catch (error) {
      console.error("Error in login API:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ success: false, message: `Method ${req.method} not allowed` });
  }
}
