import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { PredictionPanel } from './components/prediction-panel'
import { CorrelationPanel } from './components/correlation-panel'

export default function CleanerInsightsPage() {
  return (
    <>
      <Header>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main className='space-y-6 pb-10 pr-4'>
        <section>
          <div className='mb-4'>
            <h1 className='text-2xl font-semibold tracking-tight'>
              SANDEUL 모델 인사이트
            </h1>
            <p className='text-sm text-muted-foreground'>
              학생 단일 예측과 상관분석을 한 곳에서 확인해 모델 성능을 모니터링하세요.
            </p>
          </div>
          <div className='grid gap-6 lg:grid-cols-2'>
            <PredictionPanel />
            <CorrelationPanel />
          </div>
        </section>
      </Main>
    </>
  )
}
