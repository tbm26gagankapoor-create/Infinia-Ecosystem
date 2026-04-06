import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Layout } from './components/Layout'

const Home          = lazy(() => import('./pages/Home'))
const Dashboard     = lazy(() => import('./pages/Dashboard'))
const Products      = lazy(() => import('./pages/Products'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const DocIndex      = lazy(() => import('./pages/docs/DocIndex'))
const DocViewer     = lazy(() => import('./pages/docs/DocViewer'))
const Leaderboard   = lazy(() => import('./pages/Leaderboard'))
const Teams         = lazy(() => import('./pages/Teams'))
const Settings      = lazy(() => import('./pages/Settings'))
const NotFound      = lazy(() => import('./pages/NotFound'))

function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-40 gap-3">
      <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <span className="text-xs text-muted-foreground">Loading...</span>
    </div>
  )
}

export default function App() {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  return (
    <BrowserRouter basename={base}>
      <Routes>
        <Route element={<Layout />}>
          <Route index                   element={<Suspense fallback={<PageLoader />}><Home /></Suspense>} />
          <Route path="/dashboard"       element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
          <Route path="/products"        element={<Suspense fallback={<PageLoader />}><Products /></Suspense>} />
          <Route path="/products/:id"    element={<Suspense fallback={<PageLoader />}><ProductDetail /></Suspense>} />
          <Route path="/products/:id/docs/:docId" element={<Suspense fallback={<PageLoader />}><DocIndex /></Suspense>} />
          <Route path="/products/:id/docs/:docId/:slug" element={<Suspense fallback={<PageLoader />}><DocViewer /></Suspense>} />
          <Route path="/leaderboard"     element={<Suspense fallback={<PageLoader />}><Leaderboard /></Suspense>} />
          <Route path="/teams"           element={<Suspense fallback={<PageLoader />}><Teams /></Suspense>} />
          <Route path="/settings"       element={<Suspense fallback={<PageLoader />}><Settings /></Suspense>} />
          <Route path="*"              element={<Suspense fallback={<PageLoader />}><NotFound /></Suspense>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
