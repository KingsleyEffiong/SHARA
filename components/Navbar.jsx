"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
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
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    async function logout() {
        try {
            const response = await fetch("/api/v1/logout", {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                setUser(null);
                router.push("/login");
            }
        } catch (error) {
            console.error("Logout Error:", error);
        }
    }

    if (loading) return <p className='text-2xl font-bold mb-4 text-white'>Loading user...</p>;

    return (
        <div className="fixed top-0 left-0 flex flex-row justify-between w-full px-5 py-4 items-center bg-white/10 backdrop-blur-md shadow-lg rounded-b-lg z-20">
            <h1 className="text-2xl font-bold text-white">
                Welcome, {user?.name || "Guest"}!
            </h1>
            <button
                onClick={logout}
                className="px-5 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-md transition-all duration-300 font-semibold cursor-pointer"
            >
                Logout
            </button>
        </div>
    );
}

export default Navbar;
