import type { AppProps } from 'next/app'
import '@abraham/reflection'
import '@/styles/globals.scss'
import React from 'react'
import initializeFirebase from '@/lib/firebase-setup/initializeFirebase'
import Head from 'next/head'

if (typeof window === 'undefined') React.useLayoutEffect = React.useEffect

initializeFirebase()

function App({ Component, pageProps }: AppProps) {
  return <>
    <Head><title>Bookboard</title></Head>
    <Component {...pageProps} />
  </>
}

export default App