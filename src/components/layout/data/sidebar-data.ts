import {
  IconBuildings,
  IconChartHistogram,
  IconLayoutDashboard,
  IconSparkles,
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

  const cleanerItem = {
    title: 'SANDEUL Cleaner',
    url: '/cleaner',
    icon: IconSparkles,
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

  const generalItems = dashboardOnly
    ? [baseDashboardItem]
    : [
        baseDashboardItem,
        cleanerItem,
        cleanerInsightsItem,
        studentItem,
        companyItem,
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
    navGroups: [
      {
        title: 'General',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items: generalItems as any,
      },
      // {
      //   title: 'Pages',
      //   items: [
      //     {
      //       title: 'Auth',
      //       icon: IconLockAccess,
      //       items: [
      //         {
      //           title: 'Sign In',
      //           url: '/sign-in',
      //         },
      //         {
      //           title: 'Sign In (2 Col)',
      //           url: '/sign-in-2',
      //         },
      //         {
      //           title: 'Sign Up',
      //           url: '/sign-up',
      //         },
      //         {
      //           title: 'Forgot Password',
      //           url: '/forgot-password',
      //         },
      //         {
      //           title: 'OTP',
      //           url: '/otp',
      //         },
      //       ],
      //     },
      //     {
      //       title: 'Errors',
      //       icon: IconBug,
      //       items: [
      //         {
      //           title: 'Unauthorized',
      //           url: '/401',
      //           icon: IconLock,
      //         },
      //         {
      //           title: 'Forbidden',
      //           url: '/403',
      //           icon: IconUserOff,
      //         },
      //         {
      //           title: 'Not Found',
      //           url: '/404',
      //           icon: IconError404,
      //         },
      //         {
      //           title: 'Internal Server Error',
      //           url: '/500',
      //           icon: IconServerOff,
      //         },
      //         {
      //           title: 'Maintenance Error',
      //           url: '/503',
      //           icon: IconBarrierBlock,
      //         },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   title: 'Other',
      //   items: [
      //     {
      //       title: 'Settings',
      //       icon: IconSettings,
      //       items: [
      //         {
      //           title: 'Profile',
      //           url: '/settings',
      //           icon: IconUserCog,
      //         },
      //         {
      //           title: 'Account',
      //           url: '/settings/account',
      //           icon: IconTool,
      //         },
      //         {
      //           title: 'Appearance',
      //           url: '/settings/appearance',
      //           icon: IconPalette,
      //         },
      //         {
      //           title: 'Notifications',
      //           url: '/settings/notifications',
      //           icon: IconNotification,
      //         },
      //         {
      //           title: 'Display',
      //           url: '/settings/display',
      //           icon: IconBrowserCheck,
      //         },
      //       ],
      //     },
      //     {
      //       title: 'Help Center',
      //       url: '/help-center',
      //       icon: IconHelp,
      //     },
      //   ],
      // },
    ],
  }
}
