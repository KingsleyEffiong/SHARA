"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
  }, [router]); // ✅ Include router in dependencies

  return (
    <div>
      <h1>Welcome, {user?.name || "Guest"}!</h1>
    </div>
  );
}
