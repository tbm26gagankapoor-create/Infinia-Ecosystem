import { useState, useEffect } from 'react'

const cache = new Map<string, string>()

export function useMarkdownContent(path: string | null) {
  const [content, setContent] = useState<string | null>(path && cache.has(path) ? cache.get(path)! : null)
  const [loading, setLoading] = useState(!content && !!path)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!path) {
      setContent(null)
      setLoading(false)
      return
    }

    if (cache.has(path)) {
      setContent(cache.get(path)!)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    fetch(path)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load document (${res.status})`)
        return res.text()
      })
      .then(text => {
        if (cancelled) return
        cache.set(path, text)
        setContent(text)
        setLoading(false)
      })
      .catch(err => {
        if (cancelled) return
        setError(err.message)
        setLoading(false)
      })

    return () => { cancelled = true }
  }, [path])

  return { content, loading, error }
}
