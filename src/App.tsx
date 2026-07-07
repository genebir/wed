import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Timeline } from './pages/Timeline'
import { Checklist } from './pages/Checklist'
import { Gallery } from './pages/Gallery'
import { SnapPlan } from './pages/SnapPlan'
import { Budget } from './pages/Budget'
import { Vendors } from './pages/Vendors'

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="timeline" element={<Timeline />} />
        <Route path="checklist" element={<Checklist />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="snap-plan" element={<SnapPlan />} />
        <Route path="budget" element={<Budget />} />
        <Route path="vendors" element={<Vendors />} />
      </Route>
    </Routes>
  )
}
