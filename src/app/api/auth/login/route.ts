import { NextResponse } from "next/server";
import { faker } from "@faker-js/faker";

const mockUser = {
  id: "usr_mock_123",
  email: "user@rewaa.com",
  firstName: "John",
  lastName: "Doe",
  role: "admin",
  emailVerified: true,
  createdAt: new Date().toISOString(),
};

/**
 * Mock API Route: POST /api/auth/login
 * Sets HttpOnly auth cookie on successful login.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const cookieName = process.env.COOKIE_NAME || "rewaa_auth";

    const response = NextResponse.json(
      {
        statusCode: 200,
        message: "Login successful",
        data: {
          user: {
            ...mockUser,
            email: body.email || mockUser.email,
          },
          accessToken: faker.string.alphanumeric(64),
        },
      },
      { status: 200 },
    );

    // Set mock authentication cookie
    response.cookies.set(cookieName, "mock_session_token_xyz", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { statusCode: 400, message: "Invalid request payload" },
      { status: 400 },
    );
  }
}
