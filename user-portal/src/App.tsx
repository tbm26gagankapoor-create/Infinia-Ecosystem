import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Layout } from './components/Layout'

const Models = lazy(() => import('./pages/Models').then(m => ({ default: m.Models })))
const Playground = lazy(() => import('./pages/Playground').then(m => ({ default: m.Playground })))
const Usage = lazy(() => import('./pages/Usage').then(m => ({ default: m.Usage })))
const Billing = lazy(() => import('./pages/Billing').then(m => ({ default: m.Billing })))
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })))
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })))
const Analytics = lazy(() => import('./pages/analytics/Analytics').then(m => ({ default: m.Analytics })))
const Projects = lazy(() => import('./pages/Projects').then(m => ({ default: m.Projects })))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail').then(m => ({ default: m.ProjectDetail })))

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
          <Route index element={<Navigate to="/models" replace />} />
          <Route path="/models" element={<Suspense fallback={<PageLoader />}><Models /></Suspense>} />
          <Route path="/playground" element={<Suspense fallback={<PageLoader />}><Playground /></Suspense>} />
          <Route path="/projects" element={<Suspense fallback={<PageLoader />}><Projects /></Suspense>} />
          <Route path="/projects/:id" element={<Suspense fallback={<PageLoader />}><ProjectDetail /></Suspense>} />
          <Route path="/analytics" element={<Suspense fallback={<PageLoader />}><Analytics /></Suspense>} />
          <Route path="/usage" element={<Suspense fallback={<PageLoader />}><Usage /></Suspense>} />
          <Route path="/billing" element={<Suspense fallback={<PageLoader />}><Billing /></Suspense>} />
          <Route path="/dashboard" element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
          <Route path="/settings" element={<Suspense fallback={<PageLoader />}><Settings /></Suspense>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
