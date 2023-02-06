import Image from 'next/image'
import { SignInButton } from './SignInButton'

export function Header() {
  return (
    <header className='h-20 border-b border-gray-600'>
      <div className='max-w-6xl h-20 mx-auto px-8 flex items-center justify-between max-md:px-6'>
        <div className='flex items-center'>
          <Image src="/images/logo.svg" alt="ig.news" width={108} height={108} className='max-w-[110px] h-auto'
          />
          <nav className='ml-20 h-20 flex gap-8 max-md:ml-4 max-md:gap-1.5'>
            <a
              href=""
              className="
            inline-block 
            relative 
            px-2 
            h-20 
            leading-[5rem]
            hover:text-white
            transition-colors
            font-bold
            text-white
            after:content-[''] 
            after:h-[3px] 
            after:rounded-t-[3px]
            after:w-full
            after:absolute
            after:bottom-[1px]
            after:left-0
            after:bg-yellow-500
            
            "
            >Home</a>
            <a href="" className="inline-block relative px-2 h-20 leading-[5rem] text-gray-400 hover:text-white transition-colors">Posts</a>
          </nav>
        </div>
        <SignInButton />
      </div>
    </header>
  )
}