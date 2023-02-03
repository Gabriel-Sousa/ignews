import type { AppProps } from 'next/app'
import { Header } from '../components/Header'
import { SessionProvider as NextAuthProvider } from 'next-auth/react'
import { Session } from "next-auth";
import '../styles/globals.css'


export default function App({ Component, pageProps }: AppProps<{ session: Session }>) {
  return (
    <NextAuthProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    </NextAuthProvider>
  )
}
