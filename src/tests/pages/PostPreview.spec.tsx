import { asHTML, asText } from '@prismicio/helpers'
import { render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock'
import { useRouter } from 'next/router'
import { getSession, useSession } from 'next-auth/react'

import { prismic } from '../../../src/services/prismic'
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]'

jest.mock('next-auth/react', () => {
  return {
    useSession: jest.fn(),
    getSession: jest.fn()
  }
})

jest.mock("../../services/prismic", () => {
  return {
    prismic: {
      getByUID: jest.fn(),
    },
  };
});

jest.mock('next-auth/react')

jest.mock('@prismicio/helpers')

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}))

jest.mock('@prismicio/helpers')



const post = {
  slug: 'my-new-post',
  title: 'My New Post',
  content: '<p>Post excerpt</p>',
  updatedAt: 'March, 10'
}

describe('Post preview page', () => {
  it('renders correctly', () => {

    const useSessionMocked = mocked(useSession)
    const prismicMocked = mocked(prismic);
    useSessionMocked.mockReturnValueOnce({ data: null, status: 'authenticated' } as any)
    prismicMocked.getByUID.mockResolvedValue({
      post,
    } as any);

    render(<Post post={post} />)

    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
  })

  it('redirects user to full post when user is subscribed', async () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce({
      data: {
        activeSubscription: 'fake-active-subscription',
        status: 'authenticated'
      },
    } as any)

    const router = useRouter();


    render(<Post post={post} />)

    expect(router.push).toHaveBeenCalledWith('/posts/my-new-post')


  });

  it('loads initial data', async () => {
    const prismicMocked = mocked(prismic)

    const asTextMocked = jest.mocked(asText)
    const asHTMLMocked = jest.mocked(asHTML)

    asTextMocked.mockReturnValueOnce('My New Post')
    asHTMLMocked.mockReturnValueOnce('<p>Post Content</p>')

    prismicMocked.getByUID.mockReturnValueOnce({
      data: {
        data: {
          title: [
            {
              type: 'heading1',
              text: 'My New Post',
            },
          ],
          content: [
            {
              type: 'paragraph',
              text: 'Post Content',
            },
          ],
        },
      },
      last_publication_date: '2023-05-16T18:17:48+0000',
    } as any

    )

    const response = await getStaticProps({ params: { slug: 'my-new-post' } } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'My New Post',
            content: '<p>Post Content</p>',
            updatedAt: '16 de maio de 2023',
          },
        },
      }),
    )
  })

});

