import { Route, Routes } from 'react-router-dom'
import { Store, Wallet } from 'lucide-react'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Timeline } from './pages/Timeline'
import { Checklist } from './pages/Checklist'
import { Gallery } from './pages/Gallery'
import { SnapPlan } from './pages/SnapPlan'
import { ComingSoon } from './pages/ComingSoon'

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="timeline" element={<Timeline />} />
        <Route path="checklist" element={<Checklist />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="snap-plan" element={<SnapPlan />} />
        <Route
          path="budget"
          element={
            <ComingSoon
              icon={Wallet}
              title="예산 트래커"
              description="총 1,000만원 예산의 카테고리별 사용 현황."
            />
          }
        />
        <Route
          path="vendors"
          element={
            <ComingSoon
              icon={Store}
              title="업체·예약 관리"
              description="상담·계약 진행 상황을 상태별로 관리하는 페이지."
            />
          }
        />
      </Route>
    </Routes>
  )
}
