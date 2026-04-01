import { useState } from 'react'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Highlight, themes } from 'prism-react-renderer'
import { cn } from '@/lib/utils'

interface QuickstartCodeProps {
  keyMasked: string
  modelId?: string
}

export function QuickstartCode({ keyMasked, modelId = 'claude-haiku-4-5' }: QuickstartCodeProps) {
  const [lang, setLang] = useState('Python')

  const snippets: Record<string, { code: string; language: string }> = {
    Python: {
      language: 'python',
      code: `from openai import OpenAI

client = OpenAI(
    base_url="https://api.aigateway.infinia.ai/v1",
    api_key="${keyMasked}",  # or os.environ["AIGATEWAY_API_KEY"]
)

response = client.chat.completions.create(
    model="${modelId}",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)`,
    },
    'Node.js': {
      language: 'javascript',
      code: `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.aigateway.infinia.ai/v1',
  apiKey: '${keyMasked}',
});

const response = await client.chat.completions.create({
  model: '${modelId}',
  messages: [{ role: 'user', content: 'Hello!' }],
});
console.log(response.choices[0].message.content);`,
    },
    cURL: {
      language: 'bash',
      code: `curl https://api.aigateway.infinia.ai/v1/chat/completions \\
  -H "Authorization: Bearer ${keyMasked}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${modelId}",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`,
    },
    'OpenAI SDK': {
      language: 'python',
      code: `# Drop-in replacement for OpenAI SDK
import openai

openai.api_base = "https://api.aigateway.infinia.ai/v1"
openai.api_key = "${keyMasked}"

response = openai.ChatCompletion.create(
    model="${modelId}",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)`,
    },
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[lang].code)
    toast.success('Copied to clipboard')
  }

  return (
    <Tabs value={lang} onValueChange={setLang}>
      <div className="flex items-center justify-between gap-2">
        <TabsList className="h-8">
          {Object.keys(snippets).map(l => (
            <TabsTrigger key={l} value={l} className="text-xs px-3">{l}</TabsTrigger>
          ))}
        </TabsList>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handleCopy} title="Copy code">
          <Copy className="h-3.5 w-3.5" />
        </Button>
      </div>
      {Object.entries(snippets).map(([l, { code, language }]) => (
        <TabsContent key={l} value={l} className="mt-2">
          <Highlight theme={themes.oneDark} code={code} language={language}>
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre className={cn('rounded text-xs leading-relaxed overflow-x-auto p-3', className)} style={style}>
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    {line.map((token, key) => <span key={key} {...getTokenProps({ token })} />)}
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        </TabsContent>
      ))}
    </Tabs>
  )
}
