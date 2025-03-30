"use client";
import { useState } from "react";
import { Button } from "@/UI/Button";
import { Progress } from "@/UI/Progress";
// import { Card, CardContent } from "@/components/ui/card";
import QRCode from "react-qr-code";
import Input from "@/UI/Input";

export default function SendFile() {
    const [file, setFile] = useState(null);
    const [password, setPassword] = useState("");
    const [progress, setProgress] = useState(0);
    const [qrValue, setQrValue] = useState("");
    const [uploadMessage, setUploadMessage] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file || !password) return;
        console.log("Uploading:", file, password);

        setProgress(10);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("password", password);

        try {
            const response = await fetch("/api/v1/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            console.log(data)
            if (!response.ok) throw new Error(data.message);

            setProgress(100);
            setQrValue(data.downloadLink);
            setUploadMessage("Upload successful! Share the QR code to download.");
        } catch (error) {
            console.error("Upload error:", error);
            setUploadMessage("Failed to upload file.");
        }
    };

    return (
        <div className="p-4">
            <div>
                <h2 className="text-lg font-bold mb-2">Send File</h2>
                <input type="file" onChange={handleFileChange} className="mb-2" />
                <Input
                    type="password"
                    placeholder="Enter encryption password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mb-2"
                />
                <Button onClick={handleUpload} className="w-full">Upload & Generate QR</Button>

                {progress > 0 && (
                    <div className="mt-4">
                        <p className="text-sm">Uploading...</p>
                        <Progress value={progress} />
                    </div>
                )}

                {qrValue && (
                    <div className="mt-4 flex flex-col items-center">
                        <QRCode value={qrValue} size={150} />
                        <p className="text-sm mt-2">{uploadMessage}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
