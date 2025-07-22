'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { user, checkAuth } = useAuthStore();
    const { fetchCart } = useCartStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (user) {
            fetchCart();
        }
    }, [user, fetchCart]);

    return <>{children}</>;
}