import * as React from 'react'
import { ko } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
import { buttonVariants } from '@/components/ui/button'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

export interface ResponsiveCalendarProps {
  className?: string
  classNames?: any
  containerClassName?: string
  numberOfMonths?: number
  mode?: 'default' | 'range' | 'multiple' | 'single'
  showOutsideDays?: boolean
  selected?: any
  onSelect?: any
  disabled?: any
  defaultMonth?: Date
  showMultipleMonths?: boolean
  [key: string]: any
}

// 아이콘 컴포넌트
const LeftIcon = ({ isDesktop }: { isDesktop: boolean }) => {
  return <ChevronLeft className={isDesktop ? 'h-4 w-4' : 'h-3 w-3'} />
}

const RightIcon = ({ isDesktop }: { isDesktop: boolean }) => {
  return <ChevronRight className={isDesktop ? 'h-4 w-4' : 'h-3 w-3'} />
}

// 반응형 스타일 유틸리티
const getResponsiveStyles = (
  isDesktop: boolean,
  numberOfMonths: number,
  customClassNames?: Record<string, string>,
  mode?: 'default' | 'range' | 'multiple' | 'single'
) => {
  // 날짜와 요일 셀 크기 통일 - 크기 증가
  const cellSize = isDesktop ? 'w-11' : 'w-8'

  const baseStyles = {
    months: cn(
      'flex flex-col space-y-4',
      isDesktop && numberOfMonths > 1 && 'md:flex-row md:space-x-4 md:space-y-0'
    ),
    month: 'space-y-3', // 간격 확대
    caption: 'flex justify-center pt-1 relative items-center mb-2', // 하단 여백 추가
    caption_label: cn('font-medium', isDesktop ? 'text-sm' : 'text-xs'),
    nav: 'space-x-1 flex items-center',
    nav_button: cn(
      buttonVariants({ variant: 'outline' }),
      'bg-transparent p-0 opacity-50 hover:opacity-100',
      isDesktop ? 'h-7 w-7' : 'h-6 w-6'
    ),
    nav_button_previous: 'absolute left-1',
    nav_button_next: 'absolute right-1',
    table: 'w-full border-collapse',
    head_row: 'flex justify-between w-full px-1 mb-1', // 간격 조절 및 하단 여백 추가
    head_cell: cn(
      'text-muted-foreground text-center font-normal',
      cellSize,
      isDesktop ? 'text-[0.8rem]' : 'text-[0.65rem]'
    ),
    row: 'flex w-full justify-between px-1 mt-2', // 간격 조절 및 상단 여백 추가
    cell: cn(
      `relative p-0 text-center ${isDesktop ? 'text-sm' : 'text-xs'} focus-within:relative focus-within:z-20`,
      '[&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50',
      mode === 'range'
        ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
        : '[&:has([aria-selected])]:rounded-md'
    ),
    day: cn(
      buttonVariants({ variant: 'ghost' }),
      cellSize,
      isDesktop ? 'h-9' : 'h-7',
      'p-0 font-normal aria-selected:opacity-100'
    ),
    day_range_start: 'day-range-start',
    day_range_end: 'day-range-end',
    day_selected:
      'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
    day_today: 'bg-accent text-accent-foreground',
    day_outside:
      'day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground',
    day_disabled: 'text-muted-foreground opacity-50',
    day_range_middle:
      'aria-selected:bg-accent aria-selected:text-accent-foreground',
    day_hidden: 'invisible',
    ...customClassNames,
  }

  return baseStyles
}

function Calendar({
  className,
  classNames,
  containerClassName,
  numberOfMonths,
  mode,
  showOutsideDays = true,
  showMultipleMonths = false,
  ...props
}: ResponsiveCalendarProps) {
  const isMobile = useIsMobile()
  const isDesktop = !isMobile

  const [isLargeDesktop, setIsLargeDesktop] = React.useState(false)

  React.useEffect(() => {
    const checkLargeScreen = () => {
      setIsLargeDesktop(window.innerWidth >= 1024)
    }

    checkLargeScreen()
    window.addEventListener('resize', checkLargeScreen)

    return () => window.removeEventListener('resize', checkLargeScreen)
  }, [])

  const responsiveMonths = React.useMemo(() => {
    if (numberOfMonths !== undefined) return numberOfMonths
    if (showMultipleMonths && isLargeDesktop) return 2
    return 1
  }, [isLargeDesktop, numberOfMonths, showMultipleMonths])

  return (
    <div className={cn('w-full rounded-lg', containerClassName)}>
      <DayPicker
        locale={ko}
        showOutsideDays={showOutsideDays}
        numberOfMonths={responsiveMonths}
        className={cn(
          'w-full max-w-full',
          isDesktop ? 'p-3' : 'p-2',
          className
        )}
        classNames={getResponsiveStyles(
          isDesktop,
          responsiveMonths,
          classNames,
          mode
        )}
        components={{
          IconLeft: () => <LeftIcon isDesktop={isDesktop} />,
          IconRight: () => <RightIcon isDesktop={isDesktop} />,
        }}
        mode={mode}
        {...props}
      />
    </div>
  )
}

Calendar.displayName = 'Calendar'

export { Calendar }
