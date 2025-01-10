import { NextResponse } from "next/server";

export function middleware(req) {
  const response = NextResponse.next();

  // Setăm antetele CORS
  response.headers.set("Access-Control-Allow-Origin", "*"); // Sau specifică domeniul exact
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Authorization, Content-Type"
  );

  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
      },
    });
  }

  return response;
}

export const config = {
  matcher: "/api/:path*", // Aplicăm middleware doar pentru rutele API
};
