import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Layout } from './components/Layout'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Organizations = lazy(() => import('./pages/Organizations'))
const Users = lazy(() => import('./pages/Users'))
const ApiKeys = lazy(() => import('./pages/ApiKeys'))
const CostIntelligence = lazy(() => import('./pages/CostIntelligence'))
const Analytics = lazy(() => import('./pages/Analytics'))
const Billing = lazy(() => import('./pages/Billing'))
const Models = lazy(() => import('./pages/Models'))
const Providers = lazy(() => import('./pages/Providers'))
const Playground = lazy(() => import('./pages/Playground'))
const Alerts = lazy(() => import('./pages/Alerts'))
const Reports = lazy(() => import('./pages/Reports'))
const AuditLogs = lazy(() => import('./pages/AuditLogs'))
const Settings = lazy(() => import('./pages/Settings'))
const OrgDetail = lazy(() => import('./pages/OrgDetail'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-32">
      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
          <Route path="/organizations" element={<Suspense fallback={<PageLoader />}><Organizations /></Suspense>} />
          <Route path="/organizations/:id" element={<Suspense fallback={<PageLoader />}><OrgDetail /></Suspense>} />
          <Route path="/users" element={<Suspense fallback={<PageLoader />}><Users /></Suspense>} />
          <Route path="/api-keys" element={<Suspense fallback={<PageLoader />}><ApiKeys /></Suspense>} />
          <Route path="/models" element={<Suspense fallback={<PageLoader />}><Models /></Suspense>} />
          <Route path="/providers" element={<Suspense fallback={<PageLoader />}><Providers /></Suspense>} />
          <Route path="/playground" element={<Suspense fallback={<PageLoader />}><Playground /></Suspense>} />
          <Route path="/alerts" element={<Suspense fallback={<PageLoader />}><Alerts /></Suspense>} />
          <Route path="/reports" element={<Suspense fallback={<PageLoader />}><Reports /></Suspense>} />
          <Route path="/cost" element={<Suspense fallback={<PageLoader />}><CostIntelligence /></Suspense>} />
          <Route path="/analytics" element={<Suspense fallback={<PageLoader />}><Analytics /></Suspense>} />
          <Route path="/billing" element={<Suspense fallback={<PageLoader />}><Billing /></Suspense>} />
          <Route path="/audit" element={<Suspense fallback={<PageLoader />}><AuditLogs /></Suspense>} />
          <Route path="/settings" element={<Suspense fallback={<PageLoader />}><Settings /></Suspense>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
