import { NextResponse } from "next/server";

/**
 * Mock API Route: POST /api/auth/reset-password
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    if (!body.password) {
      return NextResponse.json(
        { statusCode: 400, message: "New password is required" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        statusCode: 200,
        message: "Password has been successfully updated.",
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
