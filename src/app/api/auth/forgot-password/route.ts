import { NextResponse } from "next/server";

/**
 * Mock API Route: POST /api/auth/forgot-password
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    if (!body.email) {
      return NextResponse.json(
        { statusCode: 400, message: "Email address is required" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        statusCode: 200,
        message: "If the email is registered, a password reset link has been sent.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { statusCode: 400, message: "Invalid request payload" },
      { status: 400 },
    );
  }
}
