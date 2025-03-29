"use client"
import Form from '@/components/Form';
import { useRouter } from 'next/navigation';

import React, { useState } from 'react';

function Login() {
    const [loading, setLoading] = useState(false);
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

            if (!response.ok) throw new Error(data.message);

            console.log('User logged in successfully', data);
            router.push('/')
        } catch (error) {
            console.error('Login error:', error.message);
        }
        finally {
            setLoading(false)
        }
    };

    return <Form loginUser={loginUser} loading={loading} />;
}

export default Login;
