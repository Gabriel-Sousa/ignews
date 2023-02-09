import { query as q } from 'faunadb'
import NextAuth, { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"

import { fauna } from '../../../services/fauna'

export const authOptions: NextAuthOptions = {
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
  callbacks: {
    async session({ session }) {
      try {
        const userActiveSubscription = await fauna.query<string>(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'),
                      q.Casefold(session.user?.email!)
                    )
                  )
                )
              ),
              q.Match(
                q.Index('subscription_by_status'),
                'active'
              )
            ])
          )
        )

        let { data: { status } }: any = userActiveSubscription


        return {
          ...session,
          activeSubscription: String(status)
        }
      } catch (e) {
        return {
          ...session,
          activeSubscription: null
        }
      }
    },
    async signIn({ user, account, profile }) {

      const { email } = user

      if (email) {
        try {
          await fauna.query(
            q.If(
              q.Not(
                q.Exists(
                  q.Match(
                    q.Index('user_by_email'),
                    q.Casefold(email),
                  )
                )
              ),
              q.Create(
                q.Collection('users'),
                { data: { email } }
              ),
              q.Get(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(email)
                )
              )
            )
          )
          return true

        } catch {
          return false
        }

      } else {
        alert('Error email Github!')
        return false
      }


    },
  }

}


export default NextAuth(authOptions)


































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