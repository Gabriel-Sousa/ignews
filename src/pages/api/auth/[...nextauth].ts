// import { NextApiRequest, NextApiResponse } from 'next'


// // JWT(Storage)
// // Next Auth(Social)
// // COgnito(AWS) , Auth0


// export default function users(request: NextApiRequest, response: NextApiResponse) {
//   console.log(request.query)
//   const users = [
//     { id: 1, name: 'Gabriel' },
//     { id: 2, name: 'Jubileu' },
//     { id: 3, name: 'Abacate' }
//   ]

//   return response.json(users)
// }

import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'read:user',
        }
      }
    }),
    // ...add more providers here
  ],
}

export default NextAuth(authOptions)