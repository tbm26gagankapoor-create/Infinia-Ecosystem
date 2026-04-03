import { useParams, Link, Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { useMarkdownContent } from '@/hooks/useMarkdownContent'
import { PRODUCTS } from '@/lib/mock-data'
import { stagger } from '@/lib/constants'

export default function DocViewer() {
  const { id, docId, slug } = useParams<{ id: string; docId: string; slug: string }>()
  const navigate = useNavigate()

  const product = PRODUCTS.find(p => p.id === id)
  if (!product) return <Navigate to="/products" replace />

  const doc = product.documents.find(d => d.id === docId)
  if (!doc || !doc.markdownDocs || !doc.basePath) {
    return <Navigate to={`/products/${id}`} replace />
  }

  const mdDoc = doc.markdownDocs.find(d => d.slug === slug)
  if (!mdDoc) return <Navigate to={`/products/${id}/docs/${docId}`} replace />

  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')
  const filePath = `${basePath}/${doc.basePath}/${mdDoc.filename}`
  const { content, loading, error } = useMarkdownContent(filePath)

  // Prev/next navigation
  const currentIndex = doc.markdownDocs.findIndex(d => d.slug === slug)
  const prevDoc = currentIndex > 0 ? doc.markdownDocs[currentIndex - 1] : null
  const nextDoc = currentIndex < doc.markdownDocs.length - 1 ? doc.markdownDocs[currentIndex + 1] : null

  return (
    <div className="space-y-5">
      {/* Back nav */}
      <motion.div {...stagger(0)}>
        <Link
          to={`/products/${product.id}/docs/${doc.id}`}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {doc.label}
        </Link>
      </motion.div>

      {/* Document content */}
      <motion.div {...stagger(1)}>
        <Card className="border-border/40">
          <CardContent className="p-6 sm:p-8">
            {loading && (
              <div className="flex flex-col gap-3 animate-pulse">
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-5/6" />
                <div className="h-4 bg-muted rounded w-4/6" />
                <div className="h-6 bg-muted rounded w-2/3 mt-4" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
            )}
            {error && (
              <div className="text-center py-8">
                <p className="text-sm text-destructive mb-2">Failed to load document</p>
                <p className="text-xs text-muted-foreground">{error}</p>
              </div>
            )}
            {content && <MarkdownRenderer content={content} />}
          </CardContent>
        </Card>
      </motion.div>

      {/* Prev/Next navigation */}
      <motion.div {...stagger(2)} className="flex items-center justify-between">
        {prevDoc ? (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs border-border/40"
            onClick={() => navigate(`/products/${product.id}/docs/${doc.id}/${prevDoc.slug}`)}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            {prevDoc.title}
          </Button>
        ) : <div />}
        {nextDoc ? (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs border-border/40"
            onClick={() => navigate(`/products/${product.id}/docs/${doc.id}/${nextDoc.slug}`)}
          >
            {nextDoc.title}
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        ) : <div />}
      </motion.div>
    </div>
  )
}
