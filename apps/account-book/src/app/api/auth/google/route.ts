import { NextResponse } from "next/server";

export async function GET() {

const clientId = process.env.GOOGLE_CLIENT_ID

if (!clientId) {
  return new Response('OAuth env not set', { status: 500 })
}

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${process.env.ORIGIN}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params}`,
  );
}
