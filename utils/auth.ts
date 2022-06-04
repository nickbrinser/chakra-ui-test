import { supabase } from './supabaseClient'

export const signUp = (email: string, password: string) =>
  supabase.auth.signUp({ email, password })

export const signIn = (email: string, password: string) =>
  supabase.auth.signIn({ email, password })

export const login = (email: string, password: string) =>
  supabase.auth.signIn({ email, password })

export const signOut = () => supabase.auth.signOut()
