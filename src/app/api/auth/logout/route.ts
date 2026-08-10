import { NextResponse } from "next/server";

/**
 * Mock API Route: POST /api/auth/logout
 * Deletes authentication cookie on logout.
 */
export async function POST() {
  const cookieName = process.env.COOKIE_NAME || "rewaa_auth";

  const response = NextResponse.json(
    {
      statusCode: 200,
      message: "Logged out successfully",
    },
    { status: 200 },
  );

  response.cookies.delete(cookieName);
  return response;
}
