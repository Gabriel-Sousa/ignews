import { render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock'

import { prismic } from '../../../src/services/prismic'
import Posts, { getStaticProps } from '../../pages/posts'



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
      getAllByType: jest.fn(),
    },
  };
});



const posts = [{ slug: 'my-new-post', title: 'My New Post', excerpt: 'Post excerpt', updatedAt: 'March, 10' }]

describe('Posts page', () => {
  it('renders correctly', () => {
    render(<Posts posts={posts} />)
    const prismicMocked = mocked(prismic);
    prismicMocked.getAllByType.mockResolvedValue({
      posts,
    } as any);

    expect(screen.getByText('My New Post')).toBeInTheDocument()
  })

  it('loads initial data', async () => {
    const prismicMocked = mocked(prismic)


    prismicMocked.getAllByType.mockReturnValueOnce([
      {
        uid: "fake-slug",
        data: {
          title: [
            {
              type: "heading1",
              text: "Fake title 1",
            },
          ],
          content: [
            {
              type: "paragraph",
              text: "Fake excerpt 1",
            },
          ],
        },
        last_publication_date: "2022-04-22T03:00:00.000Z",
      },
    ] as any);


    const response = await getStaticProps({ previewData: undefined });

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: "fake-slug",
              title: "Fake title 1",
              excerpt: "Fake excerpt 1",
              updatedAt: "22 de abril de 2022",
            },
          ],
        },
      })
    );
  });
});

