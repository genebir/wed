import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  CalendarRange,
  Camera,
  Cloud,
  CloudOff,
  Home,
  Images,
  ListChecks,
  Store,
  Wallet,
} from 'lucide-react'
import { isSyncActive } from '../lib/sync'
import { SyncSettings } from './SyncSettings'

const NAV_ITEMS = [
  { to: '/', label: '홈', icon: Home },
  { to: '/timeline', label: '일정', icon: CalendarRange },
  { to: '/checklist', label: '체크', icon: ListChecks },
  { to: '/gallery', label: '갤러리', icon: Images },
  { to: '/snap-plan', label: '스냅', icon: Camera },
  { to: '/budget', label: '예산', icon: Wallet },
  { to: '/vendors', label: '업체', icon: Store },
]

export function Layout() {
  const [syncOpen, setSyncOpen] = useState(false)

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* 상단 내비 (데스크톱) */}
      <header className="sticky top-0 z-40 border-b border-beige-100 bg-beige-50/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
          <NavLink to="/" className="font-serif text-lg font-semibold tracking-tight">
            쩜오의 결혼이야기
          </NavLink>
          <div className="flex items-center gap-1">
            <nav className="hidden items-center gap-1 md:flex">
              {NAV_ITEMS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                      isActive
                        ? 'bg-blush-100 font-semibold text-ink'
                        : 'text-muted hover:text-ink'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
            <button
              type="button"
              onClick={() => setSyncOpen(true)}
              aria-label="둘이 동기화 설정"
              className="ml-1 rounded-full p-2 text-muted transition-colors hover:text-ink"
            >
              {isSyncActive() ? (
                <Cloud size={18} className="text-blush-400" />
              ) : (
                <CloudOff size={18} />
              )}
            </button>
          </div>
        </div>
      </header>

      {syncOpen && <SyncSettings onClose={() => setSyncOpen(false)} />}

      <main className="mx-auto max-w-5xl px-5">
        <Outlet />
      </main>

      {/* 하단 탭바 (모바일) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-beige-100 bg-white/90 backdrop-blur md:hidden">
        <div className="grid grid-cols-7">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2 text-[10px] ${
                  isActive ? 'font-semibold text-ink' : 'text-muted'
                }`
              }
            >
              <Icon size={20} strokeWidth={1.8} />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
