import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'
import React, { PropsWithChildren, useEffect, useState } from 'react'

type ActiveLinkProps = LinkProps & {
  className?: string
  activeClassName: string
}

const ActiveLink = ({
  children,
  activeClassName,
  className,
  ...props
}: PropsWithChildren<ActiveLinkProps>) => {
  const { asPath, isReady } = useRouter()
  const [computedClassName, setComputedClassName] = useState(className)

  useEffect(() => {
    // Check if the router fields are updated client-side
    if (isReady) {
      // Dynamic route will be matched via props.as
      // Static route will be matched via props.href
      const linkPathname = new URL(
        (props.as || props.href) as string,
        location.href
      ).pathname

      // Using URL().pathname to get rid of query and hash
      const activePathname = new URL(asPath, location.href).pathname

      const newClassName =
        linkPathname === activePathname
          ? `${className} ${activeClassName}`.trim()
          : className

      if (newClassName !== computedClassName) {
        setComputedClassName(newClassName)
      }
    }
  }, [
    asPath,
    isReady,
    props.as,
    props.href,
    activeClassName,
    className,
    computedClassName,
  ])
  return (
    <Link className={computedClassName} {...props}>
      {children}
    </Link>
  )
}

export default ActiveLink

// import Link, { LinkProps } from 'next/link'
// import { ReactNode } from 'react'

// interface ActiveLinkProps extends LinkProps {
//   children: string
//   activeClassName: string;
//   className: string
// }


// export function ActiveLink({ children, activeClassName, ...props }: ActiveLinkProps) {

//   const { asPath } = useRouter()

//   const className = asPath === ...rest.href ?
//     activeClassName: ''
//   console.log(asPath)

//   return (
//     <Link {...props}>
//       {children}
//     </Link>
//   )
// }

