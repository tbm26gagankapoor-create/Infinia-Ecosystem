import type { Product } from './mock-data'
import { PRODUCTS, TOTAL_MRR, ALL_PMS } from './mock-data'

export type ProductSortKey = 'mrr' | 'mau'

export type PMSortKey = 'mrr' | 'mau' | 'growth' | 'count'

export interface PMGroup {
  pm: string
  products: Product[]
  totalMrr: number
  totalMau: number
  totalArr: number
  weightedRevGrowth: number
  weightedUsageGrowth: number
  mrrShare: number
}

export function buildPMLeaderboard(products: Product[] = PRODUCTS): PMGroup[] {
  return ALL_PMS.map(pm => {
    const pmProducts = products.filter(p => p.productManager === pm)
    const totalMrr = pmProducts.reduce((s, p) => s + p.revenue.mrr, 0)
    const totalMau = pmProducts.reduce((s, p) => s + p.usage.mau, 0)
    const totalArr = pmProducts.reduce((s, p) => s + p.revenue.arr, 0)
    const weightedRevGrowth = totalMrr > 0
      ? pmProducts.reduce((s, p) => s + p.revenue.mrr * p.revenue.growthRate, 0) / totalMrr
      : 0
    const totalMauForGrowth = pmProducts.reduce((s, p) => s + p.usage.mau, 0)
    const weightedUsageGrowth = totalMauForGrowth > 0
      ? pmProducts.reduce((s, p) => s + p.usage.mau * p.usage.growthRate, 0) / totalMauForGrowth
      : 0
    const mrrShare = TOTAL_MRR > 0 ? totalMrr / TOTAL_MRR : 0
    return { pm, products: pmProducts, totalMrr, totalMau, totalArr, weightedRevGrowth, weightedUsageGrowth, mrrShare }
  })
}

export function sortPMGroups(groups: PMGroup[], key: PMSortKey): PMGroup[] {
  return [...groups].sort((a, b) => {
    switch (key) {
      case 'mrr': return b.totalMrr - a.totalMrr
      case 'mau': return b.totalMau - a.totalMau
      case 'growth': return b.weightedRevGrowth - a.weightedRevGrowth
      case 'count': return b.products.length - a.products.length
    }
  })
}

export function sortProducts(products: Product[], key: ProductSortKey): Product[] {
  return [...products].sort((a, b) => {
    switch (key) {
      case 'mrr': return b.revenue.mrr - a.revenue.mrr
      case 'mau': return b.usage.mau - a.usage.mau
    }
  })
}
