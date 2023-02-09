import { asText } from '@prismicio/helpers'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

import { prismic } from '../../../src/services/prismic'



type Post = {
  slug: string,
  title: string,
  excerpt: string,
  updatedAt: string,
}

interface PostsProps {
  posts: Post[]
}

export default function Posts({ posts }: PostsProps) {
  const { data: session } = useSession()

  return (
    <>
      <Head>
        <title>Posts | ig.news</title>
      </Head>
      <main className='max-w-6xl mx-auto px-8'>
        <div className='max-w-3xl mt-20 mx-auto mb-0'>
          {posts.map(post => (
            <Link href={session ? `/posts/${post.slug}` : `/posts/preview/${post.slug}`} className='block group pb-8 border-b border-gray-700 mb-8 last:mb-0' key={post.slug}>
              <time className='flex items-center text-gray-400'>{post.updatedAt}</time>
              <strong className='block text-2xl mt-4 group-hover:text-yellow-500 transition-all '>{post.title}</strong>
              <p className='text-gray-400 mt-2 leading-relaxed'>{post.excerpt}</p>
            </Link>
          ))}

        </div>
      </main>
    </>
  )

}


export const getStaticProps: GetStaticProps = async () => {

  const response = await prismic.getAllByType("post", {
    fetch: ["post.title", "post.content"],
    pageSize: 100,
  })
  // console.log(JSON.stringify(response, null, 2))

  const posts = response.map((post) => {
    return {
      slug: post.uid,
      title: asText(post.data.title),
      // excerpt: post.data.find(content => content.type === 'paragraph')?.text ?? '',
      excerpt: post.data.content.find((content: any) => content.type === 'paragraph' && content?.text !== '')?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }
  })

  return {
    props: {
      posts
    },
    // revalidate: 60 * 60 * 24 // 24 hours
  }
}

