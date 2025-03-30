import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    originalname: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    encrypted: {
      type: Boolean,
      default: true, // Files are encrypted before storing
    },
    encryptionKey: {
      type: String, // Store an encrypted version of the key
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    qrCode: {
      type: String, // Store a QR code URL for easy sharing
    },
    expiresAt: {
      type: Date, // Optional: Auto-delete files after some time
      default: null,
    },
  },
  { timestamps: true }
);

// Avoid overwriting the model if it's already compiled
const File = mongoose.models.File || mongoose.model("File", fileSchema);

export default File;
