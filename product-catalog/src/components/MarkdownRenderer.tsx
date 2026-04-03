import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Highlight, themes } from 'prism-react-renderer'
import { cn } from '@/lib/utils'

function CodeBlock({ className, children }: { className?: string; children?: React.ReactNode }) {
  const match = /language-(\w+)/.exec(className || '')
  const code = String(children).replace(/\n$/, '')

  if (!match) {
    return (
      <code className="rounded bg-muted px-1.5 py-0.5 text-[13px] font-mono text-foreground">
        {children}
      </code>
    )
  }

  return (
    <Highlight theme={themes.oneDark} code={code} language={match[1]}>
      {({ className: hlClass, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={cn('rounded-lg text-[13px] leading-relaxed overflow-x-auto p-4 my-4', hlClass)} style={style}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => <span key={key} {...getTokenProps({ token })} />)}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="markdown-prose">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="text-2xl font-bold text-foreground mt-8 mb-4 first:mt-0">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-semibold text-foreground mt-8 mb-3 pb-2 border-b border-border">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">{children}</h3>,
          h4: ({ children }) => <h4 className="text-base font-semibold text-foreground mt-4 mb-2">{children}</h4>,
          p: ({ children }) => <p className="text-sm text-muted-foreground leading-relaxed mb-4">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="text-sm text-muted-foreground leading-relaxed">{children}</li>,
          a: ({ href, children }) => (
            <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-primary/40 pl-4 italic text-muted-foreground my-4">{children}</blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 rounded-lg border border-border">
              <table className="w-full text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-muted/50">{children}</thead>,
          th: ({ children }) => <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{children}</th>,
          td: ({ children }) => <td className="px-3 py-2 text-sm text-muted-foreground border-t border-border">{children}</td>,
          hr: () => <hr className="border-border my-6" />,
          strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          code: CodeBlock as any,
          pre: ({ children }) => <>{children}</>,
          img: ({ src, alt }) => (
            <img src={src} alt={alt} className="rounded-lg my-4 max-w-full" />
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  )
}
