import {
  IconBuildings,
  IconChartHistogram,
  IconCloudUpload,
  IconLayoutDashboard,
  IconTableShortcut,
  IconUsers,
} from '@tabler/icons-react'
import { User } from '@supabase/supabase-js'
import { Command } from 'lucide-react'
import { type SidebarData } from '../types'

export const getSidebarData = ({ user, dashboardOnly }: { user: User | null; dashboardOnly?: boolean }): SidebarData => {
  
  const baseDashboardItem = {
    title: '대시보드',
    url: '/',
    icon: IconLayoutDashboard,
  }

  const studentItem = {
    title: '학생 정보',
    url: '/users',
    icon: IconUsers,
  }

  const cleanerUploadItem = {
    title: '데이터 업로드',
    url: '/cleaner-upload',
    icon: IconCloudUpload,
  }

  const cleanerDataItem = {
    title: '학생 데이터',
    url: '/cleaner',
    icon: IconTableShortcut,
  }

  const cleanerInsightsItem = {
    title: '모델 인사이트',
    url: '/cleaner-insights',
    icon: IconChartHistogram,
  }

  const companyItem = {
    title: '기업 정보',
    url: '/companies',
    icon: IconBuildings,
  }

  const generalItems = [
    baseDashboardItem,
    studentItem,
    companyItem,
  ]

  const sandeulItems = [
    cleanerUploadItem,
    cleanerDataItem,
    cleanerInsightsItem,
  ]

  const navGroups = dashboardOnly
    ? [
        {
          title: 'General',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          items: [baseDashboardItem] as any,
        },
      ]
    : [
        {
          title: 'General',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          items: generalItems as any,
        },
        {
          title: 'SANDEUL',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          items: sandeulItems as any,
        },
      ]

  return {
    user: user
      ? {
          name: user.user_metadata?.name,
          email: user.email as string,
          avatar: '/avatars/shadcn.jpg',
        }
      : {
          name: '로그인되지 않음',
          email: 'guest@example.com',
          avatar: '/avatars/shadcn.jpg',
        },
    teams: [
      {
        name: 'BSMHUB Admin',
        logo: Command,
        plan: 'Vite + ShadcnUI',
      },
      // {
      //   name: 'Acme Inc',
      //   logo: GalleryVerticalEnd,
      //   plan: 'Enterprise',
      // },
      // {
      //   name: 'Acme Corp.',
      //   logo: AudioWaveform,
      //   plan: 'Startup',
      // },
    ],
    navGroups,
  }
}
