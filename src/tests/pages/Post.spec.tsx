import { asHTML, asText } from '@prismicio/helpers'
import { render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock'
import { getSession } from 'next-auth/react'

import { prismic } from '../../../src/services/prismic'
import Post, { getServerSideProps } from '../../pages/posts/[slug]'


jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/'
      }
    }
  }
})

jest.mock('next-auth/react', () => {
  return {
    useSession() {
      return { data: null, status: 'loading' }
    }
  }
})

jest.mock("../../services/prismic", () => {
  return {
    prismic: {
      getByUID: jest.fn(),
    },
  };
});

jest.mock('next-auth/react', () => {
  return {
    getSession: jest.fn()
  }
})

jest.mock('@prismicio/helpers')


const post = { slug: 'my-new-post', title: 'My New Post', content: '<p>Post excerpt</p>', updatedAt: 'March, 10' }

describe('Post page', () => {
  it('renders correctly', () => {
    render(<Post post={post} />)
    const prismicMocked = mocked(prismic);
    prismicMocked.getByUID.mockResolvedValue({
      post,
    } as any);

    expect(screen.getByText('My New Post')).toBeInTheDocument()
    expect(screen.getByText('Post excerpt')).toBeInTheDocument()
  })

  it('redirects user if no subscription is found', async () => {
    const getSessionMocked = mocked(getSession)
    getSessionMocked.mockResolvedValueOnce(null)

    const response = await getServerSideProps({ params: { slug: 'my-new-post' } } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: {
          destination: '/',
          permanent: false
        }
      })
    );
  });

  it('loads initial data', async () => {
    const prismicMocked = mocked(prismic)
    const getSessionMocked = mocked(getSession)

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

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription',
    } as any)

    const response = await getServerSideProps({ params: { slug: 'my-new-post' } } as any);

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

