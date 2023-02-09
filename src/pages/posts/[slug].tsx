import { asHTML, asText } from "@prismicio/helpers";
import { GetServerSideProps } from "next"
import Head from "next/head";
import { getSession } from "next-auth/react";

import { prismic } from "@/src/services/prismic";


interface PostProps {
  post: {
    slug: string,
    title: string,
    content: string
    updatedAt: string,
  }
}


export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>

      <main className='max-w-6xl mx-auto px-8'>
        <article className='max-w-3xl mt-20 mx-auto mb-0'>
          <h1 className='text-6xl font-black'>{post.title}</h1>
          <time className='block text-gray-400 mt-6'>{post.updatedAt}</time>
          <div className="post mt-8 text-xl text-gray-300" dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const session = await getSession({ req });
  const { slug } = params!

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const response = await prismic.getByUID('post', String(slug))

  const post = {
    slug,
    title: asText(response.data.title),
    content: asHTML(response.data.content),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return {
    props: {
      post
    }
  }
}