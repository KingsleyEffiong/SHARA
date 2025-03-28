import { NextResponse } from "next/server";
import User from "@/model/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "@/config/env";
import connectToDB from "@/utils/database";

export async function POST(req) {
  try {
    await connectToDB();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return NextResponse.json(
        { success: false, error: "Invalid password" },
        { status: 401 }
      );
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "User logged in successfully",
        data: { token, user },
      },
      { status: 200 }
    );

    response.headers.set(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; ${
        process.env.NODE_ENV === "production" ? "Secure; " : ""
      }SameSite=Lax; Max-Age=3600`
    );

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: error.statusCode || 500 }
    );
  }
}
