import { NextResponse } from "next/server";
import fs from "fs";
import crypto from "crypto";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// ✅ Decrypt function (remains the same)
const decryptFile = (filePath, password) => {
  try {
    const key = crypto.createHash("sha256").update(password).digest();
    const encryptedData = fs.readFileSync(filePath);

    if (encryptedData.length < 16) {
      console.error("❌ Invalid encrypted file, too small to contain IV.");
      return null;
    }

    const iv = encryptedData.slice(0, 16);
    const encryptedContent = encryptedData.slice(16);

    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let decryptedData;
    try {
      decryptedData = Buffer.concat([
        decipher.update(encryptedContent),
        decipher.final(),
      ]);
    } catch (err) {
      console.error(
        "❌ Decryption failed: Incorrect password or file corrupted"
      );
      return null;
    }

    const outputPath = filePath.replace(".enc", "");
    fs.writeFileSync(outputPath, decryptedData);
    return outputPath;
  } catch (error) {
    console.error("❌ Decryption error:", error);
    return null;
  }
};

// ✅ POST: File Access API (Removed Token Requirement)
export async function POST(req) {
  try {
    let data;
    try {
      data = await req.json();
      console.log("📩 Received Data:", data);
    } catch (error) {
      console.error("❌ JSON Parse Error:", error);
      return NextResponse.json(
        { error: "Invalid JSON format" },
        { status: 400 }
      );
    }

    const { fileName, password } = data;

    if (!fileName || !password) {
      return NextResponse.json(
        { error: "File name and password required" },
        { status: 400 }
      );
    }

    const encryptedPath = path.join(UPLOAD_DIR, fileName);
    if (!fs.existsSync(encryptedPath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const decryptedPath = decryptFile(encryptedPath, password);

    if (!decryptedPath) {
      return NextResponse.json(
        { error: "Decryption failed. Invalid password or corrupted file." },
        { status: 400 }
      );
    }

    console.log("✅ Decryption successful for file:", decryptedPath);
    return NextResponse.json({
      message: "Decryption successful",
      downloadLink: `/uploads/${path.basename(decryptedPath)}`,
    });
  } catch (error) {
    console.error("❌ POST Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
