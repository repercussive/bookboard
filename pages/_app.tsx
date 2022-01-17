import type { AppProps } from 'next/app'
import React from 'react'
import '@abraham/reflection'
import '@/styles/globals.scss'

if (typeof window === 'undefined') React.useLayoutEffect = React.useEffect

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp