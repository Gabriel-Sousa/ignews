import { render, screen } from '@testing-library/react'

import ActiveLink from '../../../src/components/ActiveLink'


jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/'
      }
    }
  }
})

describe('ActiveLink component', () => {


  it('renders correctly', () => {
    render(
      <ActiveLink href={'/'} activeClassName='active'>
        Home
      </ActiveLink>
    )

    expect(screen.getByText('Home')).toBeInTheDocument()

  })


  it('adds active class active if the link as currently active', () => {
    render(
      <ActiveLink href={'/'} className='active' activeClassName='active'>
        Home
      </ActiveLink>
    )
    expect(screen.getByText('Home')).toHaveClass('active')

  })
})