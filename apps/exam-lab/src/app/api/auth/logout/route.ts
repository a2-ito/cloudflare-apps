import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  // Clear the session cookie
  response.cookies.set({
    name: "session",
    value: "",
    expires: new Date(0), // Set to past date to delete cookie
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });

  return response;
}
