import { signIn, useSession } from "next-auth/react"
import { api } from "../services/api"
import { getStripeJs } from "../services/stripe-js"

interface SubscribeButtonProps {
  priceID: string
}

// getServerSideProps (SSR)
// getStaticProps (SSG)
// API routes 

export function SubscribeButton({ priceID }: SubscribeButtonProps) {
  const { data: session } = useSession()

  async function handleSubscribe() {
    if (!session) {
      signIn('github')
      return
    }

    // criação da checkout session
    const response = await api.post('/subscribe')
    console.log(response)

    try {
      console.log('a')
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