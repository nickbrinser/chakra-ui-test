import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { supabase } from 'utils/supabaseClient'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/Option'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'

export default function EditAccount({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log(user)
  return <></>
}

export const getServerSideProps = (context: GetServerSidePropsContext) => {
  const userRes = supabase.auth.api.getUserByCookie(context.req)

  return pipe(
    () => userRes,
    T.map(res => (res.error ? E.left(res.error) : E.right(res))),
    TE.foldW(
      () => T.of({ redirect: { destination: '/Login', permanent: false } }),
      ({ user }) => T.of({ props: { user: O.fromNullable(user) } }),
    ),
    invokeTask => invokeTask(),
  )
}
