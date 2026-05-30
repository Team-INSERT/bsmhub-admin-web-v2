import Cookies from 'js-cookie'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { IconAlertTriangle } from '@tabler/icons-react'
import { AuthSessionMissingError, User } from '@supabase/supabase-js'
import { cn } from '@/lib/utils'
import supabase from '@/utils/supabase/client'
import { Database } from '@/utils/supabase/database.types'
import { SearchProvider } from '@/context/search-context'
import { UserProvider } from '@/context/user-context'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import SkipToMain from '@/components/skip-to-main'

type CachedUserData = {
  user: User
  adminStatus: {
    canAccess: string
    isReadonly: boolean
    dashboardOnly: boolean
  }
}
let cachedUserData: CachedUserData | null = null

export const Route = createFileRoute('/_authenticated')({
  component: RouteComponent,
  beforeLoad: async ({ matches }) => {
    let user: User
    let adminStatus: CachedUserData['adminStatus']

    // 같은 사용자로 이미 로드되었다면 캐시된 데이터 재사용
    if (cachedUserData) {
      user = cachedUserData.user
      adminStatus = cachedUserData.adminStatus
    } else {
      const {
        data: { user: authUser },
        error,
      } = await supabase.auth.getUser()
      if (error instanceof AuthSessionMissingError || !authUser) {
        throw redirect({
          to: '/sign-in',
        })
      } else if (error) throw error

      adminStatus = await getAdminStatus(authUser.id)

      if (!adminStatus.canAccess) {
        throw redirect({
          to: '/403',
        })
      }

      user = authUser
      // 이번에 로드한 데이터를 캐시에 저장
      cachedUserData = { user, adminStatus }
    }

    // dashboard_only 권한은 대시보드(_authenticated index) 외 라우트 접근 차단.
    // location.pathname은 basepath(/admin)를 포함하므로 basepath와 무관한
    // leaf 라우트 id로 판정해야 무한 리다이렉트 루프가 발생하지 않는다.
    const leafRouteId = matches[matches.length - 1]?.routeId
    if (adminStatus.dashboardOnly && leafRouteId !== '/_authenticated/') {
      throw redirect({ to: '/' })
    }

    return {
      user,
      isReadonly: adminStatus.isReadonly,
      dashboardOnly: adminStatus.dashboardOnly,
    }
  },
})

function ReadOnlyBanner() {
  const bannerText =
    '이 계정은 읽기 전용입니다. 수정 권한을 위해선 insert25.team@gmail.com 로 연락주세요.'
  const BannerContent = () => (
    <>
      <IconAlertTriangle className='flex-shrink-0' size={16} />
      <span className='mx-4'>{bannerText}</span>
    </>
  )

  return (
    <div className='flex items-center gap-2 overflow-hidden bg-warning p-2 text-sm text-warning-foreground'>
      <div className='flex min-w-0 flex-1'>
        <div className='flex w-full flex-shrink-0 animate-marquee items-center whitespace-nowrap'>
          <BannerContent />
        </div>
        <div
          className='flex w-full flex-shrink-0 animate-marquee items-center whitespace-nowrap'
          aria-hidden='true'
        >
          <BannerContent />
        </div>
      </div>
    </div>
  )
}

function RouteComponent() {
  const { user, isReadonly, dashboardOnly } = Route.useRouteContext()
  const defaultOpen = Cookies.get('sidebar:state') !== 'false'

  return (
    <>
      {isReadonly && <ReadOnlyBanner />}
      <UserProvider user={user || null}>
        <SearchProvider>
          <SidebarProvider defaultOpen={defaultOpen}>
            <SkipToMain />
            <AppSidebar dashboardOnly={dashboardOnly} />
            <div
              id='content'
              className={cn(
                'ml-auto w-full max-w-full',
                'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
                'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
                'transition-[width] duration-200 ease-linear',
                'flex h-svh flex-col',
                'group-data-[scroll-locked=1]/body:h-full',
                'group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh'
              )}
            >
              <Outlet />
            </div>
          </SidebarProvider>
        </SearchProvider>
      </UserProvider>
    </>
  )
}
async function getAdminStatus(id: string) {
  const { data, error } = await supabase
    .from('web_admin_permission')
    .select('role')
    .eq('auth_id', id)
    .single()

  if (error || !data) {
    throw error
  }

  const role =
    data.role as Database['public']['Enums']['web_admin_permission_enum']

  return {
    canAccess: role,
    isReadonly: ['dashboard_only', 'view_all'].includes(role),
    dashboardOnly: role === 'dashboard_only',
  }
}
