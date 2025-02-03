'use client'; // Ensures the component is rendered client-side

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const router = useRouter();
    // const router = useRouter(); // For redirecting after successful registration
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();

        const response = await fetch(`${apiUrl}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            setStatusMessage('Registration successful! Redirecting to login...');

            router.push('/matechecker'); // Red
        } else {
            setStatusMessage(data.message || 'Registration failed');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
            <form onSubmit={handleRegister}>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700"
                >
                    Register
                </button>
            </form>

            {/* Status Message */}
            {statusMessage && <p className="mt-4 text-center text-sm font-semibold">{statusMessage}</p>}
        </div>
    );
};

export default RegisterForm;
