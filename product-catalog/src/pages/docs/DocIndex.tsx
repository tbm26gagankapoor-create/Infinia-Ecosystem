import { useParams, Link, Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft, ArrowRight, FileText, BarChart2, BookOpen, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { ProductIcon } from '@/components/ProductIcon'

import { PRODUCTS, type DocType } from '@/lib/mock-data'
import { stagger } from '@/lib/constants'

const DOC_TYPE_ICON: Record<DocType, typeof FileText> = {
  prd: FileText,
  'market-research': BarChart2,
  onepager: Zap,
  technical: BookOpen,
}

export default function DocIndex() {
  const { id, docId } = useParams<{ id: string; docId: string }>()
  const navigate = useNavigate()
  const product = PRODUCTS.find(p => p.id === id)

  if (!product) return <Navigate to="/products" replace />

  const doc = product.documents.find(d => d.id === docId)
  if (!doc || !doc.markdownDocs || doc.markdownDocs.length === 0) {
    return <Navigate to={`/products/${id}`} replace />
  }

  const Icon = DOC_TYPE_ICON[doc.type]

  return (
    <div className="space-y-5">
      {/* Back nav */}
      <motion.div {...stagger(0)}>
        <Link
          to={`/products/${product.id}`}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {product.name}
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div {...stagger(1)} className="flex items-start gap-4">
        <div
          className="p-2.5 rounded-lg shrink-0"
          style={{
            backgroundColor: doc.accentColor ? `${doc.accentColor}15` : 'var(--primary-10)',
            color: doc.accentColor || 'var(--primary)',
          }}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">{doc.label}</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-[640px]">{doc.description}</p>
          <div className="flex items-center gap-2.5 mt-2 text-[11px] text-muted-foreground/60">
            <ProductIcon icon={product.icon} className="text-sm" />
            <span>{product.name}</span>
            <span>·</span>
            <span>{doc.markdownDocs.length} documents</span>
          </div>
        </div>
      </motion.div>

      {/* Document list */}
      <motion.div {...stagger(2)} className="flex flex-col gap-2">
        {doc.markdownDocs.map((mdDoc, index) => (
          <Card
            key={mdDoc.slug}
            className="border-border/40 hover:border-border/80 cursor-pointer group transition-colors"
            onClick={() => navigate(`/products/${product.id}/docs/${doc.id}/${mdDoc.slug}`)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-8 w-8 rounded-md bg-muted/60 text-muted-foreground flex-shrink-0">
                  <span className="text-xs font-mono font-semibold">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {mdDoc.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {mdDoc.description}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </div>
  )
}
