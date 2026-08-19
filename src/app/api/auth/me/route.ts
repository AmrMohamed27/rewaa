import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const mockUser = {
  id: "usr_mock_123",
  email: "user@rewaa.com",
  firstName: "علي",
  lastName: "أحمد",
  role: "admin",
  emailVerified: true,
  createdAt: new Date().toISOString(),
};

/**
 * Mock API Route: GET /api/auth/me
 * Checks if authentication cookie exists. Returns 401 if missing.
 */
export async function GET() {
  const cookieStore = await cookies();
  const cookieName = process.env.COOKIE_NAME || "rewaa_auth";
  const authCookie = cookieStore.get(cookieName);
  const roleCookie = cookieStore.get("rewaa_role");

  if (!authCookie || !authCookie.value) {
    return NextResponse.json(
      {
        statusCode: 401,
        message: "Unauthorized",
        error: "Unauthorized",
      },
      { status: 401 },
    );
  }

  const role = roleCookie?.value === "student" ? "student" : "assistant";

  return NextResponse.json(
    {
      statusCode: 200,
      message: "Profile retrieved successfully",
      data: {
        ...mockUser,
        role,
      },
    },
    { status: 200 },
  );
}
