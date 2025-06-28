import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

type AuthUser = {
    email: string;
};

export const useSupabaseUser = () => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user?.email) {
                setUser({ email: user.email });
            } else {
                setUser(null);
            }

            setLoading(false);
        };

        getUser();
    }, []);

    return { user, loading };
};