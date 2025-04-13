"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import QRCode from "react-qr-code";
import Navbar from "@/components/Navbar";

export default function ReceiveFile() {
  const searchParams = useSearchParams();
  const fileName = searchParams.get("file");
  const expiryTime = parseInt(searchParams.get("expiresIn"), 10);

  const [password, setPassword] = useState("");
  const [decryptedLink, setDecryptedLink] = useState(null);
  const [error, setError] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [timeLeft, setTimeLeft] = useState(expiryTime - Date.now());

  useEffect(() => {
    if (fileName) {
      const url = `${
        window.location.origin
      }/receive-file?file=${encodeURIComponent(fileName)}`;
      setQrCode(url);
    }
  }, [fileName]);

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(expiryTime - Date.now());
    }, 1000);

    if (timeLeft <= 0) {
      clearInterval(interval);
      setError("File expired and has been deleted.");
    }

    return () => clearInterval(interval);
  }, [expiryTime, timeLeft]);

  const handleDecrypt = async () => {
    if (timeLeft <= 0) {
      setError("File has expired and cannot be accessed.");
      return;
    }

    setError(null);
    try {
      const response = await fetch("/api/v1/access-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName, password }),
      });

      const data = await response.json();
      if (response.ok && data.downloadLink) {
        setDecryptedLink(data.downloadLink);
      } else {
        setError(data.error || "Invalid password or decryption failed.");
      }
    } catch (err) {
      setError("Something went wrong.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center h-screen items-center fixed top-0 left-0 inset-0 pointer-events-none">
        <div className="pointer-events-auto">
          <div className="flex flex-col md:flex-row w-full h-screen mt-44 md:mt-0 overflow-auto md:h-auto  bg-white  shadow-lg shadow-gray-800 rounded-lg">
            <div className="p-4 w-full h-fit bg-white rounded-lg">
              <h2 className="text-lg font-bold mb-3">Download Your File</h2>

              {qrCode && (
                <div className="flex justify-center mb-4">
                  <QRCode value={qrCode} size={128} />
                </div>
              )}

              {timeLeft > 0 ? (
                <p className="text-red-500">
                  File expires in: {Math.max(0, Math.floor(timeLeft / 1000))}s
                </p>
              ) : (
                <p className="text-red-500">File has expired.</p>
              )}

              {decryptedLink ? (
                <a
                  href={decryptedLink}
                  download
                  className="mt-4 block w-full text-center bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                  ⬇ Download File
                </a>
              ) : (
                <>
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    disabled={timeLeft <= 0}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mt-3"
                    required
                  />
                  <button
                    onClick={handleDecrypt}
                    className={`w-full mt-2 bg-[#002e2e] text-white p-2 rounded ${
                      timeLeft <= 0
                        ? "cursor-not-allowed opacity-50"
                        : "hover:bg-[#045b5b] cursor-pointer"
                    }`}
                    disabled={timeLeft <= 0}
                  >
                    🔑 Decrypt & Download
                  </button>
                </>
              )}

              {error && <p className="text-red-500 mt-3">{error}</p>}
            </div>
            <div className="p-6 w-full min-h-screen md:min-h-auto md:overflow-hidden bg-[#002e2e] shadow-md flex flex-col justify-center items-center">
              <div className="max-w-3xl text-center">
                <h1 className="text-white text-3xl">
                  Simple, private file sharing
                </h1>
                <p className="text-white mt-4 leading-relaxed">
                  This application is a secure file upload and encryption system
                  built with Next.js, and MongoDB and Node js. It allows users
                  to upload files, which are then encrypted using AES-256-CBC
                  encryption before being stored securely on the server. The
                  system ensures that sensitive data remains protected, and only
                  authorized users can download and decrypt files.
                  <br />
                  <br />
                  The application also features a robust database integration,
                  storing metadata such as file names, sizes, and upload
                  timestamps. Additionally, users receive a secure download
                  link, enabling controlled file access. With real-time database
                  connectivity and a seamless user experience, this application
                  is ideal for scenarios requiring confidential file handling,
                  such as document management, secure file sharing, and
                  compliance-driven data storage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
