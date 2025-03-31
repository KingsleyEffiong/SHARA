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
                className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 mt-2"
                disabled={timeLeft <= 0}
              >
                🔑 Decrypt & Download
              </button>
            </>
          )}

          {error && <p className="text-red-500 mt-3">{error}</p>}
        </div>
      </div>
    </div>
  );
}
