"use client"
import Form from '@/components/Form';
import { useRouter } from 'next/navigation';

import React, { useState } from 'react';

function Login() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    const loginUser = async (formData) => {
        setLoading(true)
        try {
            const response = await fetch('/api/v1/login', { // Ensure correct login endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json(); // Await response properly

            if (!response.ok) throw new Error(data.error);
            router.push('/send-document')
        } catch (error) {
            console.error('Login error:', error.message);
            setError(error.message)
        }
        finally {
            setLoading(false)
        }
    };

    return <Form loginUser={loginUser} loading={loading} error={error} />;
}

export default Login;
