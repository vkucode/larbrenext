export default function handler(req, res) {
  res.setHeader(
    "Set-Cookie",
    `admin_token=; Path=/; HttpOnly; Secure; Max-Age=0;`
  );
  res.status(200).json({ message: "Logout successful" });
}
