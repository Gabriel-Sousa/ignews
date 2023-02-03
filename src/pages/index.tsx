import Head from 'next/head'
import Image from "next/image"

import { GetStaticProps } from 'next'
import { SubscribeButton } from '../components/SubscribeButton'
import { stripe } from '../services/stripe'

interface HomeProps {
  product: {
    priceID: string
    amount: number
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className='max-w-6xl mx-auto px-8 flex items-center justify-between'>
        <section className='max-w-lg'>
          <span className='font-bold text-2xl'>👏 Hey, welcome!</span>
          <h1 className='mt-10 font-extrabold text-7xl '>News About the<span className='text-cyan-400'> React</span> world</h1>
          <span className='mt-8 mb-10 text-2xl block'>Get access to all the publications<br /> <span className='text-cyan-400'> for {product.amount} month</span></span>
          <SubscribeButton priceID={product.priceID} />
        </section>
        <Image src="/images/avatar.svg" alt="" width={334} height={520} className="mt-28" />

      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1LcuwOFCWv7gmhO1CafUG887', {
    expand: ['product']
  })

  const product = {
    priceID: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount! / 100),

  }
  return {
    props: {
      product
    }, revalidate: 60 * 60 * 24 // 24 hours
  }
}
