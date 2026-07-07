import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { TriangleAlert, Wallet } from 'lucide-react'
import { budget, wedding } from '../data'
import { Card } from '../components/Card'
import { ProgressBar } from '../components/ProgressBar'
import { FadeUp } from '../components/FadeUp'

// 검증된 8색 카테고리 팔레트 (흰 카드 표면 기준, 슬라이스 간 흰색 갭 + 범례 직접 라벨과 함께 사용)
const SERIES = ['#CE6A5F', '#1D9E83', '#B8862B', '#4E7DC0', '#C06C93', '#5E9444', '#8365B5', '#B36A24']
const OVER_BUDGET = '#D03B3B'

function won(n: number): string {
  return `${n.toLocaleString('ko-KR')}원`
}

export function Budget() {
  const totalSpent = budget.reduce((sum, b) => sum + b.spent, 0)
  const remaining = wedding.totalBudget - totalSpent
  const spentPercent = Math.round((totalSpent / wedding.totalBudget) * 100)

  const chartData = budget.map((b, i) => ({
    name: b.category,
    value: b.planned,
    color: SERIES[i % SERIES.length],
  }))

  return (
    <div className="space-y-14 py-20">
      <FadeUp>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">예산</h1>
        <p className="mt-3 text-muted">총 {won(wedding.totalBudget)} 안에서 즐겁게.</p>
      </FadeUp>

      {/* 요약 + 잔여 예산 */}
      <FadeUp delay={80}>
        <Card className="p-8">
          <div className="mb-6 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-muted">총 예산</p>
              <p className="mt-1 text-lg font-bold tracking-tight md:text-2xl">
                {won(wedding.totalBudget)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">사용</p>
              <p className="mt-1 text-lg font-bold tracking-tight md:text-2xl">
                {won(totalSpent)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">잔여</p>
              <p className="mt-1 text-lg font-bold tracking-tight text-blush-400 md:text-2xl">
                {won(remaining)}
              </p>
            </div>
          </div>
          <ProgressBar percent={spentPercent} />
          <p className="mt-2 text-right text-xs text-muted">{spentPercent}% 사용</p>
        </Card>
      </FadeUp>

      {/* 도넛 차트: 카테고리별 계획 비중 */}
      <FadeUp delay={120}>
        <Card className="p-8">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">
            <Wallet size={18} className="text-blush-400" /> 카테고리 비중 (계획 기준)
          </h2>
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="60%"
                    outerRadius="95%"
                    stroke="#FFFFFF"
                    strokeWidth={2}
                    isAnimationActive={false}
                  >
                    {chartData.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => won(Number(value))}
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid #F3EDE3',
                      fontSize: 13,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* 범례: 색 점 + 이름 + 금액 (직접 라벨) */}
            <ul className="space-y-2.5">
              {chartData.map((d) => (
                <li key={d.name} className="flex items-center gap-2.5 text-sm">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: d.color }}
                  />
                  <span className="flex-1">{d.name}</span>
                  <span className="tabular-nums text-muted">{won(d.value)}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </FadeUp>

      {/* 카테고리별 집행 현황 */}
      <FadeUp delay={160}>
        <section>
          <h2 className="mb-5 text-xl font-bold tracking-tight">카테고리별 집행</h2>
          <div className="space-y-3">
            {budget.map((b) => {
              const over = b.spent > b.planned
              const percent = b.planned > 0 ? Math.round((b.spent / b.planned) * 100) : 0
              return (
                <Card key={b.category} className="p-5">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{b.category}</span>
                      {over && (
                        <span
                          className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold text-white"
                          style={{ backgroundColor: OVER_BUDGET }}
                        >
                          <TriangleAlert size={11} /> 예산 초과
                        </span>
                      )}
                    </div>
                    <span className="text-sm tabular-nums text-muted">
                      {won(b.spent)} / {won(b.planned)}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-beige-100">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${Math.min(100, percent)}%`,
                        backgroundColor: over ? OVER_BUDGET : '#E8AFA9',
                      }}
                    />
                  </div>
                  {b.memo && <p className="mt-2 text-xs text-muted">{b.memo}</p>}
                </Card>
              )
            })}
          </div>
          <p className="mt-3 text-xs text-muted">
            지출 기록은 <code>src/data/budget.json</code>의 <code>spent</code> 값 수정.
          </p>
        </section>
      </FadeUp>
    </div>
  )
}
