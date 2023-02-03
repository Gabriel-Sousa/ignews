interface SubscribeButtonProps {
  priceID: string
}

export function SubscribeButton({ priceID }: SubscribeButtonProps) {
  return (
    <button
      type="button"
      className='bg-yellow-500 rounded-full py-5 px-16 text-black text-xl font-bold transition-all hover:brightness-[0.8]'
    >
      Subscribe now
    </button>
  )
}