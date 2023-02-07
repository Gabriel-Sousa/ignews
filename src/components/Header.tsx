import Image from 'next/image'
import ActiveLink from './ActiveLink'
import { SignInButton } from './SignInButton'

export function Header() {

  const routes = [
    {
      path: '/',
      name: 'Home',
    },
    {
      path: "/posts",
      name: "Posts"
    }
  ]

  return (
    <header className='h-20 border-b border-gray-600'>
      <div className='max-w-6xl h-20 mx-auto px-8 flex items-center justify-between max-md:px-6 transition-all'>
        <div className='flex items-center'>
          <Image src="/images/logo.svg" alt="ig.news" width={108} height={108} className='max-w-[110px] h-auto'
          />
          <nav className='ml-20 h-20 flex gap-8 max-md:ml-4 max-md:gap-1.5 transition-all'>
            {routes.map((route, i) => (
              <ActiveLink key={route.path}
                activeClassName="
                 after:content-[''] 
                 after:h-[3px] 
                 after:rounded-t-[3px] 
                 after:w-full
                 after:absolute
                 after:bottom-[1px]
                 after:left-0
                 after:bg-yellow-500
               "

                href={route.path}

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
             "
              >{route.name}
              </ActiveLink>
            ))}


          </nav>
        </div>
        <SignInButton />
      </div>
    </header >
  )
}