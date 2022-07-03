import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React from 'react'
import { Provider } from 'jotai'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <React.StrictMode>
        <Component {...pageProps} />
      </React.StrictMode>
    </Provider>
  )
}

export default MyApp
