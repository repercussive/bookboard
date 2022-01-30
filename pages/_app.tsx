import type { AppProps } from 'next/app'
import '@abraham/reflection'
import '@/styles/globals.scss'
import React from 'react'
import initializeFirebase from '@/lib/firebase-setup/initializeFirebase'

if (typeof window === 'undefined') React.useLayoutEffect = React.useEffect

initializeFirebase()

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp