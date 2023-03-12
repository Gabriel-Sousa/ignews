import { fireEvent, render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock'
import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/react'

import { SubscribeButton } from '../../../src/components/SubscribeButton'

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}))

jest.mock('next-auth/react')

describe('SubscribeButton component', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce({ data: null, status: 'loading' })
    render(
      <SubscribeButton />
    )

    expect(screen.getByText('Subscribe now')).toBeInTheDocument()
  })

  it('redirects user to sign in when not authenticated', () => {
    const signInMocked = mocked(signIn)
    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce({ data: null, status: 'authenticated' } as any)

    render(
      <SubscribeButton />
    )

    const subscribeButton = screen.getByText('Subscribe now')
    fireEvent.click(subscribeButton)

    expect(signInMocked).toHaveBeenCalled()
  })

  it('redirects to posts when user already has a subscription', () => {
    const useSessionMocked = mocked(useSession)

    const router = useRouter();

    useSessionMocked.mockReturnValueOnce({
      data: {
        user: { name: "John Doe", email: "john.doe@example.com" },
        expires: "fake-expires",
        activeSubscription: 'fake-active-subscription',
        status: 'authenticated'
      },
    } as any)
    render(
      <SubscribeButton />
    )

    const subscribeButton = screen.getByText('Subscribe now')
    fireEvent.click(subscribeButton)

    expect(router.push).toHaveBeenCalledWith('/posts')
  })


})