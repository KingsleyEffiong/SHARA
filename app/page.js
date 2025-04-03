"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SendFile from "./send-document/page";
import Navbar from "@/components/Navbar";

export default function Dashboard() {
  return (
    <div className="p-6">
      {/* ✅ SendFile Component */}
      <Navbar />
    </div>
  );
}
