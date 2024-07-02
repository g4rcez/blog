import { BlogConfig } from '@/blog.config'

export function Logomark(props: React.ComponentPropsWithoutRef<'span'>) {
  return <span {...props}>{BlogConfig.name}</span>
}

export function Logo(props: React.ComponentPropsWithoutRef<'span'>) {
  return <span {...props}>{BlogConfig.name}</span>
}
