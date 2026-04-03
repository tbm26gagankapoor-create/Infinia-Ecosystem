import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Layout } from './components/Layout'
import { ThemeProvider } from './lib/theme'

const Home          = lazy(() => import('./pages/Home'))
const Dashboard     = lazy(() => import('./pages/Dashboard'))
const Products      = lazy(() => import('./pages/Products'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Analytics     = lazy(() => import('./pages/Analytics'))
const Teams         = lazy(() => import('./pages/Teams'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-40">
      <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  return (
    <ThemeProvider>
      <BrowserRouter basename={base}>
        <Routes>
          <Route element={<Layout />}>
            <Route index                   element={<Suspense fallback={<PageLoader />}><Home /></Suspense>} />
            <Route path="/dashboard"       element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
            <Route path="/products"        element={<Suspense fallback={<PageLoader />}><Products /></Suspense>} />
            <Route path="/products/:id"    element={<Suspense fallback={<PageLoader />}><ProductDetail /></Suspense>} />
            <Route path="/analytics"       element={<Suspense fallback={<PageLoader />}><Analytics /></Suspense>} />
            <Route path="/teams"           element={<Suspense fallback={<PageLoader />}><Teams /></Suspense>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
