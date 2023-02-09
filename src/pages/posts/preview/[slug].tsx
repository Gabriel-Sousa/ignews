import Head from "next/head";
import Link from "next/link";
import { prismic } from "../../../../src/services/prismic";
import { asHTML, asText } from "@prismicio/helpers";
import { GetStaticPaths, GetStaticProps } from "next"
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";


interface PostPreviewProps {
  post: {
    slug: string,
    title: string,
    content: string
    updatedAt: string,
  }
}


export default function PostPreview({ post }: PostPreviewProps) {
  const { data: session } = useSession()

  console.log(session)

  const router = useRouter()

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }
  }, [router, post, session])


  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>

      <main className='max-w-6xl mx-auto px-8'>
        <article className='max-w-3xl mt-20 mx-auto mb-0'>
          <h1 className='text-6xl font-black'>{post.title}</h1>
          <time className='block text-gray-400 mt-6'>{post.updatedAt}</time>
          <div className="post preview bg-gradient-to-b from-gray-400 to-transparent bg-clip-text fill-transparent mt-8 text-xl text-gray-300" dangerouslySetInnerHTML={{ __html: post.content }} />
          <div className="p-8 text-center bg-gray-800 rounded-full text-lg font-bold mt-16 mx-0 mb-8 ">
            Wanna continue reading? <Link href={'/'} className="text-yellow-500 ml-2 hover:underline">Subscribe now 🤗</Link>
          </div>
        </article>
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
  // return {
  //   paths: [params: {slug: 'prisma-uma-das-melhores-coisas-que-ja-aconteceu-no' }],
  //   fallback: 'blocking',
  // }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params!



  const response = await prismic.getByUID('post', String(slug))

  const post = {
    slug,
    title: asText(response.data.title),
    content: asHTML(response.data.content.splice(0, 3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return {
    props: {
      post
    },
    revalidate: 60 * 30 // 30 minutes
  }
}