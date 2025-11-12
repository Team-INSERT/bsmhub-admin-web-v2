import { useRef, useState } from 'react'
import { IconMaximize, IconMinimize } from '@tabler/icons-react'
import { useTheme } from '@/context/theme-context'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Skeleton } from '@/components/ui/skeleton'

export default function Dashboard() {
  const { theme } = useTheme()
  const grafanaSrc = `/d/degaj6kbosoowe/bsmhubtest?orgId=1&from=now-30d&to=now&timezone=browser&var-join_at_year=2023&refresh=auto&kiosk&theme=${
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme
  }`
  const objectRef = useRef<HTMLObjectElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleFullscreen = () => {
    const el = objectRef.current
    if (!el) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
      setIsFullscreen(false)
    } else {
      if (el.requestFullscreen) {
        el.requestFullscreen()
        setIsFullscreen(true)
      } else if (
        (el as HTMLObjectElement & { webkitRequestFullscreen?: () => void })
          .webkitRequestFullscreen
      ) {
        ;(el as HTMLObjectElement & { webkitRequestFullscreen?: () => void })
          .webkitRequestFullscreen!()
        setIsFullscreen(true)
      } else if (
        (el as HTMLObjectElement & { msRequestFullscreen?: () => void })
          .msRequestFullscreen
      ) {
        ;(el as HTMLObjectElement & { msRequestFullscreen?: () => void })
          .msRequestFullscreen!()
        setIsFullscreen(true)
      }
    }
  }

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main fixed>
        <div className='relative h-full w-full' ref={objectRef}>
          {isLoading && (
            <div className='h-full min-h-[600px] w-full space-y-4 rounded-lg p-4'>
              <Skeleton className='h-12 w-full' />
              <Skeleton className='h-full w-full' />
            </div>
          )}
          <object
            key={theme}
            type='text/html'
            data-testid='grafana-iframe'
            data={grafanaSrc}
            onLoad={() => setIsLoading(false)}
            className={`h-full min-h-[600px] w-full rounded-lg bg-background ${isLoading ? 'hidden' : ''}`}
          ></object>
          <Button
            type='button'
            onClick={handleFullscreen}
            variant='default'
            size='sm'
            className='absolute bottom-4 right-4 z-10'
            style={{ pointerEvents: 'auto' }}
          >
            {isFullscreen ? (
              <IconMinimize size={16} />
            ) : (
              <IconMaximize size={16} />
            )}
          </Button>
        </div>
      </Main>
    </>
  )
}
