import '../styles/globals.css'

import type { AppProps } from 'next/app'
import { Session } from "next-auth";
import { SessionProvider as NextAuthProvider } from 'next-auth/react'

import { Header } from '../components/Header'


export default function App({ Component, pageProps }: AppProps<{ session: Session }>) {
  return (
    <NextAuthProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    </NextAuthProvider>
  )
}
