export default function handler(req, res) {
  if (req.method === "POST") {
    const { user, pass } = req.body;

    const USER_ADMIN = process.env.USER_ADMIN;
    const PASS_ADMIN = process.env.PASS_ADMIN;

    if (user === USER_ADMIN && pass === PASS_ADMIN) {
      return res.status(200).json({ success: true });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid login or password" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} not allowed` });
  }
}
