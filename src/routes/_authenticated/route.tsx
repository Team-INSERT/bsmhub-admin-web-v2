import Cookies from 'js-cookie'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { IconAlertTriangle } from '@tabler/icons-react'
import { AuthSessionMissingError } from '@supabase/supabase-js'
import { cn } from '@/lib/utils'
import supabase from '@/utils/supabase/client'
import { SearchProvider } from '@/context/search-context'
import { UserProvider } from '@/context/user-context'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import SkipToMain from '@/components/skip-to-main'

export const Route = createFileRoute('/_authenticated')({
  component: RouteComponent,
  beforeLoad: async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error instanceof AuthSessionMissingError || !user) {
      throw redirect({
        to: '/sign-in',
      })
    } else if (error) throw error

    const adminStatus = await getAdminStatus(user.id)

    if (!adminStatus.canAccess) {
      throw redirect({
        to: '/403',
      })
    }
    return { user, isReadonly: adminStatus.isReadonly }
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
  const { user, isReadonly } = Route.useRouteContext()
  const defaultOpen = Cookies.get('sidebar:state') !== 'false'

  return (
    <>
      {isReadonly && <ReadOnlyBanner />}
      <UserProvider user={user || null}>
        <SearchProvider>
          <SidebarProvider defaultOpen={defaultOpen}>
            <SkipToMain />
            <AppSidebar />
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
  const [permission, readonly] = await Promise.all([
    supabase.from('web_admin_permission').select('auth_id').eq('auth_id', id),
    supabase.from('web_admin_readonly').select('auth_id').eq('auth_id', id),
  ])

  if (permission.error) {
    throw permission.error
  }
  if (readonly.error) {
    throw readonly.error
  }

  const hasPermission = permission.data && permission.data.length > 0
  const hasReadonly = readonly.data && readonly.data.length > 0

  return {
    canAccess: hasPermission || hasReadonly,
    isReadonly: !hasPermission && hasReadonly,
  }
}
