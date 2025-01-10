// pages/api/login.js
import { NextResponse } from "next/server";

export async function POST(req) {
  const { user, pass } = await req.json();

  // Preluăm datele din fișierul .env
  const USER_ADMIN = process.env.USER_ADMIN;
  const PASS_ADMIN = process.env.PASS_ADMIN;

  // Verificăm dacă datele coincid
  if (user === USER_ADMIN && pass === PASS_ADMIN) {
    return NextResponse.json({ success: true });
  }

  // Dacă datele nu coincid, returnăm eroare
  return NextResponse.json(
    { success: false, message: "Invalid login or password" },
    { status: 401 }
  );
}
