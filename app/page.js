"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SendFile from "./send-document/page";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/v1/getuser", {
          method: "GET",
          credentials: "include", // Send cookies with request
        });

        if (response.status === 401) {
          router.push("/login");
          return;
        }

        const data = await response.json();
        if (!response.ok)
          throw new Error(data?.message || "Failed to fetch user");

        setUser(data.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [router]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {user?.name || "Guest"}!
      </h1>

      {/* ✅ SendFile Component */}
      <SendFile />
    </div>
  );
}
