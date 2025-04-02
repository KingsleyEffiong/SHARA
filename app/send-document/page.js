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
        <div className="flex flex-col md:flex-row w-full gap-5 bg-white align-center shadow-lg shadow-gray-800 rounded-lg p-5">
          <div className="p-4 w-full bg-white rounded-lg">
            <h2 className="text-lg font-bold mb-3">
              Upload Encrypted Document
            </h2>
            {!fileLink ? (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full p-2 border border-gray-300 rounded outline outline-[#002e2e]"
                  required
                />
                <input
                  type="password"
                  placeholder="Enter password (required)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded outline outline-[#002e2e]"
                />
                <button
                  type="submit"
                  className="w-full bg-[#002e2e] text-white p-2 rounded hover:bg-[#045b5b] cursor-pointer"
                >
                  Encrypt & Upload
                </button>
                {error && <p className="text-red-500 mt-3">{error}</p>}
              </form>
            ) : (
              <div className="mt-4">
                <p className="text-[#002e2e] font-bold">Share this link:</p>
                <input
                  type="text"
                  value={fileLink}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded mt-2"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(fileLink)}
                  className="w-full mt-2 bg-[#002e2e] text-white p-2 rounded hover:bg-[#045b5b] cursor-pointer"
                >
                  Copy Link
                </button>
                <div className="mt-4 flex justify-center">
                  <QRCode value={fileLink} size={150} />
                </div>
              </div>
            )}
          </div>
          <div className="p-4 w-full bg-[#002e2e] shadow-md">
            <h1 className="text-white text-3xl">
              Simple, private file sharing
            </h1>
            <p className="text-white">
              This application is a secure file upload and encryption system
              built with Next.js, Firebase, and MongoDB. It allows users to
              upload files, which are then encrypted using AES-256-CBC
              encryption before being stored securely on the server. The system
              ensures that sensitive data remains protected, and only authorized
              users can download and decrypt files. The application also
              features a robust database integration, storing metadata such as
              file names, sizes, and upload timestamps. Additionally, users
              receive a secure download link, enabling controlled file access.
              With real-time database connectivity and a seamless user
              experience, this application is ideal for scenarios requiring
              confidential file handling, such as document management, secure
              file sharing, and compliance-driven data storage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
