"use client"
import Form from '@/components/Form';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

function SignUp() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const signUpUser = async (formData) => {
        setLoading(true);

        try {
            const response = await fetch('/api/v1/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            console.log('User signed up successfully', data);
            router.push('/login')
        } catch (error) {
            console.error('Signup error:', error.message);
        } finally {
            setLoading(false);
        }
    };

    return <Form signUpUser={signUpUser} loading={loading} />;
}

export default SignUp;
