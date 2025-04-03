import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json(
      { success: true, message: "User logged out successfully" },
      { status: 200 }
    );

    response.headers.set(
      "Set-Cookie",
      "token=; HttpOnly; Path=/; Expires=00:00:Thu, 01 Jan 1970 00 GMT; SameSite=Lax"
    );

    return response;
  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
