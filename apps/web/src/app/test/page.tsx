'use client'
import { useEffect, useState } from 'react';

const Protected = () => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            setMessage('You are not authenticated.');
            return;
        }

        const fetchData = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/protected`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
            } else {
                setMessage(data.message || 'Access denied.');
            }
        };

        fetchData();
    }, []);

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-center mb-6">Protected Page</h2>
            <p>{message}</p>
        </div>
    );
};

export default Protected;
