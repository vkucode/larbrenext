import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY; // Cheia secretă din .env
const COOKIE_NAME = "admin_token"; // Numele cookie-ului pentru token

export default function middleware(req) {
  const token = req.cookies[COOKIE_NAME];
  const url = req.nextUrl.clone();

  // Permitem accesul la pagina de login (/admin)
  if (url.pathname === "/admin") {
    return NextResponse.next();
  }

  // Protejăm toate celelalte rute din /admin
  if (url.pathname.startsWith("/admin")) {
    try {
      jwt.verify(token, SECRET_KEY);
      return NextResponse.next(); // Acces permis
    } catch (err) {
      // Dacă token-ul este invalid sau lipsește, redirecționăm la /admin (login)
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}
