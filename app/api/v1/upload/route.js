import { NextResponse } from "next/server";
import fs from "fs";
import crypto from "crypto";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const encryptFile = (filePath, password) => {
  try {
    const key = crypto.createHash("sha256").update(password).digest();
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    const input = fs.readFileSync(filePath);
    const encrypted = Buffer.concat([iv, cipher.update(input), cipher.final()]);

    const encryptedFilePath = `${filePath}.enc`;
    fs.writeFileSync(encryptedFilePath, encrypted);

    return encryptedFilePath;
  } catch (error) {
    console.error("Encryption error:", error);
    return null;
  }
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const password = formData.get("password");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(UPLOAD_DIR, file.name);
    fs.writeFileSync(filePath, fileBuffer);

    const encryptedPath = encryptFile(filePath, password);
    if (!encryptedPath) {
      return NextResponse.json({ error: "Encryption failed" }, { status: 500 });
    }

    // Remove original file after encryption
    fs.unlinkSync(filePath);

    const expiryTimestamp = Date.now() + 10 * 60 * 1000; // Expires in 10 minutes
    const fileName = path.basename(encryptedPath);

    return NextResponse.json({
      success: true,
      fileName,
      expiresIn: expiryTimestamp,
      url: `/receive-file?file=${fileName}&expiresIn=${expiryTimestamp}`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
