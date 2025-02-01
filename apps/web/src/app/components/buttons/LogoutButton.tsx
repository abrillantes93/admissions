'use client';
import { useRouter } from 'next/navigation';

const LogoutButton = () => {
    const router = useRouter();

    const handleLogout = () => {
        // Assuming the token is stored in localStorage. Adjust if using cookies.
        localStorage.removeItem('token');

        // Redirect to the login page or home page after logout
        router.push('/login');
    };

    return (
        <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
            Logout
        </button>
    );
};

export default LogoutButton;
