declare namespace NodeJS {
  export interface ProcessEnv {
    HOST: string
    NEXT_PUBLIC_SUPABASE_URL: string
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    DB_URL: string
    DB_NAME?: string
  }
}
