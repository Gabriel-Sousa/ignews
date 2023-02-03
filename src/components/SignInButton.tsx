import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { signIn, signOut, useSession } from 'next-auth/react';

export function SignInButton() {
  const { data: session } = useSession()



  return session ? (
    <button type="button"
      onClick={() => { signOut() }}
      className='flex items-center gap-4 bg-gray-800 py-3 px-4 rounded-full font-bold transition-all  hover:brightness-[0.8]'>
      <FaGithub size={24} className="text-green-500" />
      <span>Gabriel Sousa</span>
      <FiX size={20} className="text-gray-500" />
    </button>
  ) : (
    <button
      type="button"
      onClick={() => { signIn("github") }}
      className='flex items-center gap-4 bg-gray-800 py-3 px-4 rounded-full font-bold transition-all  hover:brightness-[0.8]'>
      <FaGithub size={24} className="text-yellow-500" />
      <span>Sign in with GitHub</span>
    </button>
  )
}