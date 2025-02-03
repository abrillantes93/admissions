'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ClientLayoutProps {
    children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
    const router = useRouter();

    useEffect(() => {
        // Check for token in localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            // If no token found, redirect to /login
            router.push('/');
        }
        // If a token exists, do nothing and continue rendering children
    }, [router]);

    return <>{children}</>;
}
