import React from 'react'
import * as RD from '@devexperts/remote-data-ts'
import { Session } from '@supabase/gotrue-js'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/Option'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'

import { supabase } from './supabaseClient'

export type CurrentSession = RD.RemoteData<Error, Session> // NOTE: this could potentially be O.Option<User>
export const UserContext = React.createContext<CurrentSession>(RD.initial)

interface UserProviderProps {
  children: React.ReactNode
}

export const UserContextProvider: React.FC<UserProviderProps> = ({
  children,
}) => {
  const [currentSession, setCurrentSession] = React.useState<CurrentSession>(
    RD.pending,
  )

  React.useEffect(() => {
    const initialSession = pipe(
      supabase.auth.session(),
      O.fromNullable,
      O.fold(
        () => RD.initial,
        s => RD.success(s),
      ),
    )

    setCurrentSession(initialSession)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        pipe(session, sessionToRD, setCurrentSession)
        updateSupabaseCookie(event, session)
      },
    )
    return () => {
      authListener?.unsubscribe()
    }
  }, [])

  return (
    <UserContext.Provider value={currentSession}>
      {children}
    </UserContext.Provider>
  )
}

const updateSupabaseCookie = (event: string, session: Session | null) =>
  pipe(
    TE.tryCatch(
      () =>
        fetch('/api/set', {
          method: 'POST',
          headers: new Headers({ 'Content-Type': 'application/json' }),
          credentials: 'same-origin',
          body: JSON.stringify({ event, session }),
        }),
      E.toError,
    ),
    TE.chain(response => TE.tryCatch(() => response.json(), E.toError)),
    T.map(E.fold(console.error, console.log)),
    invokeTask => invokeTask(),
  )

const sessionToRD = (session: Session | null) =>
  pipe(session, O.fromNullable, d => RD.fromOption(d, Error))

export function useSession() {
  const context = React.useContext(UserContext)
  return context
}
