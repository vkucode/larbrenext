import { NextResponse } from "next/server";

export function middleware(req) {
  const origin = req.headers.get("origin");
  console.log("Origin:", origin);
  console.log("Request Method:", req.method);

  const response = NextResponse.next();

  // Setăm antetele CORS
  response.headers.set("Access-Control-Allow-Origin", origin || "*");
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
        "Access-Control-Allow-Origin": origin || "*",
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
