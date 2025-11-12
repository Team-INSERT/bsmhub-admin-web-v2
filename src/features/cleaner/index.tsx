import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DatasetCleaningPanel } from './components/dataset-cleaning-panel'
import { StudentDatasetsPanel } from './components/student-datasets-panel'

export default function CleanerPage() {
  return (
    <>
      <Header>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main className='space-y-6 pb-10'>
        <section>
          <div className='mb-4'>
            <h1 className='text-2xl font-semibold tracking-tight'>
              SANDEUL Cleaner
            </h1>
            <p className='text-sm text-muted-foreground'>
              기수별 SANDEUL 원본 데이터를 정제하고 SQLite에 적재하는 업로드
              허브입니다.
            </p>
          </div>
          <DatasetCleaningPanel />
        </section>
        <section>
          <StudentDatasetsPanel />
        </section>
      </Main>
    </>
  )
}
