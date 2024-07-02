import { type Node } from '@markdoc/markdoc'
import { DocsHeader } from '@/components/docs-header'
import { PrevNextLinks } from '@/components/prev-next-links'
import { Prose } from '@/components/prose'
import { TableOfContents } from '@/components/table-of-contents'
import { collectSections } from '@/lib/sections'

type Frontmatter = Partial<{
  title: string
  type: string
}>

export function DocsLayout({
  children,
  frontmatter,
  nodes,
}: {
  children: React.ReactNode
  frontmatter: Frontmatter
  nodes: Array<Node>
}) {
  const tableOfContents = collectSections(nodes)
  const title = frontmatter.title
  return (
    <>
      <div className="min-w-0 max-w-2xl flex-auto px-4 py-16 lg:max-w-none lg:pl-8 lg:pr-0 xl:px-16">
        <article>
          <DocsHeader title={title} />
          <Prose>{children}</Prose>
        </article>
        <PrevNextLinks />
      </div>
      {frontmatter.type !== 'index' ? (
        <TableOfContents tableOfContents={tableOfContents} />
      ) : null}
    </>
  )
}
