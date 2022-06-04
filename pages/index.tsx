import { Button, Heading, Link, Spinner, Stack } from '@chakra-ui/react'
import * as RD from '@devexperts/remote-data-ts'
import NextLink from 'next/link'
import { signOut } from 'utils/auth'
import { useSession } from 'utils/userContext'
import { pipe } from 'fp-ts/lib/function'

export default function IndexPage() {
  const session = useSession()
  return (
    <Stack spacing={4}>
      <Heading color="whiteAlpha.900">
        {pipe(
          session,
          RD.fold(
            () => (
              <>
                <NextLink href="/Login" passHref>
                  <Link color="gradient.to">Login</Link>
                </NextLink>
              </>
            ),
            () => <Spinner />,
            e => <>{e.message}</>,
            s => (
              <Stack spacing={4} alignItems="center">
                <span>{s.user?.id} </span>
                <Button onClick={() => signOut()} textColor="gradient.to">
                  Log Out
                </Button>
                <NextLink href="/app/editaccount" passHref>
                  <Link color="gradient.to">Edit Account</Link>
                </NextLink>
              </Stack>
            ),
          ),
        )}
      </Heading>
    </Stack>
  )
}
