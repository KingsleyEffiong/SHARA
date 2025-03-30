import { NextResponse } from "next/server";
import fs from "fs";
import crypto from "crypto";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// Ensure uploads folder exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const encryptFile = (filePath, password) => {
  return new Promise((resolve, reject) => {
    try {
      const key = crypto.createHash("sha256").update(password).digest();
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

      const input = fs.createReadStream(filePath);
      const output = fs.createWriteStream(`${filePath}.enc`);

      output.write(iv); // Store IV for decryption
      input.pipe(cipher).pipe(output);

      output.on("finish", () => {
        resolve(`${filePath}.enc`);
      });

      output.on("error", reject);
    } catch (error) {
      reject(error);
    }
  });
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const password = formData.get("password");

    if (!file || !password) {
      return NextResponse.json(
        { error: "File and password required" },
        { status: 400 }
      );
    }

    const filePath = path.join(UPLOAD_DIR, file.name);
    console.log("Saving file to:", filePath);

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await fs.promises.writeFile(filePath, fileBuffer); // ✅ Wait for file to be fully saved

    console.log("File saved successfully:", filePath);

    // Encrypt file after saving
    const encryptedPath = await encryptFile(filePath, password);

    // Delete the original file after encryption
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("Deleted original file:", filePath);
    }

    // Auto-delete encrypted file after 10 minutes
    setTimeout(() => {
      if (fs.existsSync(encryptedPath)) {
        fs.unlinkSync(encryptedPath);
        console.log("Auto-deleted encrypted file:", encryptedPath);
      }
    }, 10 * 60 * 1000);

    return NextResponse.json({
      message: "Upload successful",
      downloadLink: `/uploads/${path.basename(encryptedPath)}`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
