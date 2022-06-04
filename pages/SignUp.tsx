import React from 'react'
import {
  Box,
  Button,
  FormControl,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Text,
  useBoolean,
  useToast,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { signUp } from 'utils/auth'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/lib/function'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'

export default function SignUp() {
  const [showPassword, setShowPassword] = useBoolean(false)
  const [email, setEmail] = React.useState<string>('')
  const [password, setPassword] = React.useState<string>('')

  const toast = useToast()
  const { push } = useRouter()

  const handleSignUp = pipe(
    () => signUp(email, password),
    T.map(res => (res.error ? E.left(res.error) : E.right(res))),
    TE.foldW(
      err =>
        T.fromIO(() =>
          toast({
            title: 'Something went wrong.',
            description: err.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
          }),
        ),
      () => {
        toast({
          title: 'Account Created!',
          description: "We've created your account for you.",
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        return T.of(push('/'))
      },
    ),
  )
  return (
    <Box minW={['xs', 'sm']}>
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
        backgroundColor="whiteAlpha.900"
        boxShadow="md"
        borderRadius="5"
        paddingY="16"
      >
        <Heading fontSize={['2xl', '3xl']} color="text">
          Sign Up
        </Heading>
        <form
          onSubmit={e => {
            e.preventDefault()
            handleSignUp()
          }}
        >
          <Stack spacing={6} p="1rem">
            <FormControl>
              <InputGroup>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    variant="ghost"
                    textColor="gradient.to"
                    onClick={setShowPassword.toggle}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Button
              type="submit"
              variant="solid"
              borderRadius="100"
              bgGradient="linear(to-r, gradient.from, gradient.to)"
              textColor="whiteAlpha.800"
              _hover={{
                bgGradient: 'linear(to-r, gradient.from, gradient.to)',
              }}
            >
              Log In
            </Button>
            <Text textAlign="center">
              Already registered?{' '}
              <NextLink href="/Login" passHref>
                <Link color="gradient.to">Login</Link>
              </NextLink>
            </Text>
          </Stack>
        </form>
      </Stack>
    </Box>
  )
}
