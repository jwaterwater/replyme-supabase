import { supabase } from '@/lib/supabase';
import { Router } from 'expo-router';
import { create } from 'zustand';


type AuthState = {
  check: (arg:Router) => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  check: async (router) => {
    const { data, error:authError } = await supabase.auth.getSession();
    if (authError || !data.session) {
        router.replace('/login')
    }
  },
  signOut: async () => {
    await supabase.auth.signOut();
  },
}));



