import { ChakraProvider, Flex } from '@chakra-ui/react'
import { theme } from '@styles/chakraTheme'
import { AppProps } from 'next/app'
import { UserContextProvider } from 'utils/userContext'
function App({ Component, pageProps }: AppProps) {
  return (
    <UserContextProvider>
      <ChakraProvider theme={theme}>
        <Flex
          flexDirection="column"
          width="100wh"
          height="100vh"
          backgroundColor="gray.700"
          justifyContent="center"
          alignItems="center"
        >
          <Component {...pageProps} />
        </Flex>
      </ChakraProvider>
    </UserContextProvider>
  )
}

export default App
