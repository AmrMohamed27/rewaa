import { NextResponse } from "next/server";
import { faker } from "@faker-js/faker";

/**
 * Mock API Route: POST /api/auth/register
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    return NextResponse.json(
      {
        statusCode: 201,
        message: "Registration successful. Please verify your email.",
        data: {
          id: faker.string.uuid(),
          email: body.email || "newuser@rewaa.com",
          firstName: body.firstName || "Jane",
          lastName: body.lastName || "Smith",
          role: "user",
          emailVerified: false,
          createdAt: new Date().toISOString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { statusCode: 400, message: "Invalid request payload" },
      { status: 400 },
    );
  }
}
