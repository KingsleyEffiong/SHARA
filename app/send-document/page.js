"use client";
import { useState } from "react";
import QRCode from "react-qr-code";

export default function UploadDocument() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [fileLink, setFileLink] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setFileLink("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("password", password);

    try {
      const response = await fetch("/api/v1/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.fileName && data.expiresIn) {
        setFileLink(
          `${window.location.origin}/receive-file?file=${data.fileName}&expiresIn=${data.expiresIn}`
        );
      } else {
        setError("Upload failed: Missing file data.");
      }
    } catch (err) {
      setError("Failed to upload the document.");
    }
  };

  return (
    <div className="flex justify-center px-6 items-center fixed inset-0 pointer-events-none">
      <div className="pointer-events-auto">
        <div className="p-4 w-full bg-white shadow-md rounded-lg">
          <h2 className="text-lg font-bold mb-3">Upload Encrypted Document</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="password"
              placeholder="Enter password (required)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Encrypt & Upload
            </button>
          </form>

          {error && <p className="text-red-500 mt-3">{error}</p>}

          {fileLink && (
            <div className="mt-4">
              <p className="text-green-600 font-bold">Share this link:</p>
              <input
                type="text"
                value={fileLink}
                readOnly
                className="w-full p-2 border border-gray-300 rounded mt-2"
              />
              <button
                onClick={() => navigator.clipboard.writeText(fileLink)}
                className="w-full mt-2 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
              >
                Copy Link
              </button>

              <div className="mt-4 flex justify-center">
                <QRCode value={fileLink} size={150} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
