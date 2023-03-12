import { useRouter } from "next/router"
import { signIn, useSession } from "next-auth/react"

import { api } from "../services/api"
import { getStripeJs } from "../services/stripe-js"


// getServerSideProps (SSR)
// getStaticProps (SSG)
// API routes 

export function SubscribeButton() {
  const { data: session } = useSession()
  const router = useRouter()

  async function handleSubscribe() {
    if (!session) {
      signIn('github')
      return
    }

    if (session.activeSubscription) {
      router.push('/posts')
      return
    }
    // criação da checkout session

    try {
      const response = await api.post('/subscribe')
      const { sessionId } = response.data

      const stripe = await getStripeJs()

      await stripe?.redirectToCheckout({ sessionId })

    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <button
      type="button"
      className='bg-yellow-500 rounded-full py-5 px-16 text-black text-xl font-bold transition-all hover:brightness-[0.8]'
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  )
}

