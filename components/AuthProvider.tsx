'use client';

import { useEffect, useState } from 'react';
import { configureAmplify } from '@/lib/auth';
import { AuthContextProvider } from '@/contexts/AuthContext';

interface AuthProviderProps {
    children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
    const [isConfigured, setIsConfigured] = useState(false);

    useEffect(() => {
        configureAmplify();
        setIsConfigured(true);
    }, []);

    if (!isConfigured) {
        return null;
    }

    return <AuthContextProvider>{children}</AuthContextProvider>;
}
