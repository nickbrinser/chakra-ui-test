import { ApiError, Provider, Session, User } from '@supabase/supabase-js'

export type SignInResponse = {
  session: Session | null
  user: User | null
  provider?: Provider
  url?: string | null
  error: ApiError | null
}
