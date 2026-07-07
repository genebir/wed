import { Route, Routes } from 'react-router-dom'
import { Camera, Images, Store, Wallet } from 'lucide-react'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Timeline } from './pages/Timeline'
import { Checklist } from './pages/Checklist'
import { ComingSoon } from './pages/ComingSoon'

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="timeline" element={<Timeline />} />
        <Route path="checklist" element={<Checklist />} />
        <Route
          path="gallery"
          element={
            <ComingSoon
              icon={Images}
              title="셀프 스냅 갤러리"
              description="무드·장소 필터로 레퍼런스를 모아보는 갤러리."
            />
          }
        />
        <Route
          path="snap-plan"
          element={
            <ComingSoon
              icon={Camera}
              title="셀프 스냅 촬영 계획"
              description="장소 후보, 장비 체크리스트, 샷 리스트를 관리하는 페이지."
            />
          }
        />
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
