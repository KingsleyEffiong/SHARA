"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import QRCode from "react-qr-code";

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
    <div className="flex justify-center items-center fixed inset-0 pointer-events-none">
      <div className="pointer-events-auto">
        <div className="flex flex-row w-full gap-5 bg-white align-center shadow-lg shadow-gray-800 rounded-lg p-5">
          <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-lg">
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
                  className="w-full mt-2 bg-[#002e2e] text-white p-2 rounded hover:bg-[#045b5b] cursor-pointer"
                  disabled={timeLeft <= 0}
                >
                  🔑 Decrypt & Download
                </button>
              </>
            )}

            {error && <p className="text-red-500 mt-3">{error}</p>}
          </div>
        </div>
        <div className="p-4 w-full bg-[#002e2e] shadow-md">
          <h1 className="text-white text-3xl">Simple, private file sharing</h1>
          <p className="text-white">
            This application is a secure file upload and encryption system built
            with Next.js, Firebase, and MongoDB. It allows users to upload
            files, which are then encrypted using AES-256-CBC encryption before
            being stored securely on the server. The system ensures that
            sensitive data remains protected, and only authorized users can
            download and decrypt files. The application also features a robust
            database integration, storing metadata such as file names, sizes,
            and upload timestamps. Additionally, users receive a secure download
            link, enabling controlled file access. With real-time database
            connectivity and a seamless user experience, this application is
            ideal for scenarios requiring confidential file handling, such as
            document management, secure file sharing, and compliance-driven data
            storage.
          </p>
        </div>
      </div>
    </div>
  );
}
