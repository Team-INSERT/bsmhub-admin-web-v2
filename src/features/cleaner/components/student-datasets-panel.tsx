import { useMemo, useState } from 'react'
import { IconLoader2, IconRefresh, IconUsersGroup } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Loader from '@/components/loader'
import {
  CLEANER_DATASETS,
  CLEANER_GENERATIONS,
  ALL_GENERATIONS_TAB,
  type CleanerGenerationTabValue,
  type CleanerGenerationValue,
} from '../constants'
import { fetchStudents, type StudentRecord } from '../api'

const datasetLabelMap = CLEANER_DATASETS.reduce(
  (acc, dataset) => {
    acc[dataset.field] = dataset.label
    acc[dataset.field.replace('_file', '')] = dataset.label
    return acc
  },
  {} as Record<string, string>,
)

const generationTabs: Array<{
  value: CleanerGenerationTabValue
  label: string
  helper: string
}> = [
  { value: ALL_GENERATIONS_TAB, label: '전체', helper: '모든 기수' },
  ...CLEANER_GENERATIONS.map((generation) => ({
    value: generation.value as CleanerGenerationTabValue,
    label: generation.label,
    helper: `${generation.year}년`,
  })),
]

export function StudentDatasetsPanel() {
  const [activeTab, setActiveTab] =
    useState<CleanerGenerationTabValue>(ALL_GENERATIONS_TAB)
  const [condensedView, setCondensedView] = useState(true)

  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['cleaner-students', activeTab],
    queryFn: () =>
      fetchStudents(
        activeTab === ALL_GENERATIONS_TAB
          ? undefined
          : (activeTab as CleanerGenerationValue),
      ),
    staleTime: 1000 * 60 * 2,
  })

  const students = data?.students ?? []
  const totalDatasets = useMemo(
    () => students.reduce((acc, student) => acc + student.datasets.length, 0),
    [students],
  )

  return (
    <Card>
      <CardHeader>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div>
            <CardTitle>학생 데이터 미리보기</CardTitle>
            <CardDescription>
              `/students` API에서 조회한 정제 데이터를 기수별로 빠르게 확인하세요.
            </CardDescription>
          </div>
          <div className='flex items-center gap-4'>
            <label className='flex items-center gap-2 text-sm text-muted-foreground'>
              <Checkbox
                id='condensed-view'
                checked={condensedView}
                onCheckedChange={(checked) =>
                  setCondensedView(Boolean(checked))
                }
              />
              요약 보기
            </label>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() => refetch()}
              disabled={isFetching}
            >
              {isFetching ? (
                <IconLoader2 className='mr-2 size-4 animate-spin' />
              ) : (
                <IconRefresh className='mr-2 size-4' />
              )}
              새로고침
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        <Tabs
          value={String(activeTab)}
          onValueChange={(value) =>
            setActiveTab(
              value === ALL_GENERATIONS_TAB
                ? ALL_GENERATIONS_TAB
                : (Number(value) as CleanerGenerationValue),
            )
          }
          className='w-full'
        >
          <TabsList className='flex w-full flex-wrap gap-2'>
            {generationTabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={String(tab.value)}
                className='flex-1 rounded-lg data-[state=active]:bg-muted'
              >
                <div className='flex flex-col items-center text-sm'>
                  <span className='font-semibold'>{tab.label}</span>
                  <span className='text-[11px] text-muted-foreground'>
                    {tab.helper}
                  </span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
          {generationTabs.map((tab) => (
            <TabsContent
              key={tab.value}
              value={String(tab.value)}
              className='mt-4 space-y-4'
            >
              <SummaryRow
                totalStudents={students.length}
                totalDatasets={totalDatasets}
                generationLabel={
                  tab.value === ALL_GENERATIONS_TAB ? '전체' : tab.label
                }
              />
              <StudentTable
                students={students}
                isLoading={isLoading}
                condensedView={condensedView}
              />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

function SummaryRow({
  totalStudents,
  totalDatasets,
  generationLabel,
}: {
  totalStudents: number
  totalDatasets: number
  generationLabel: string
}) {
  return (
    <div className='grid gap-3 rounded-xl border bg-card/40 p-4 text-sm sm:grid-cols-3'>
      <div className='flex items-center gap-3'>
        <div className='flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary'>
          <IconUsersGroup className='size-5' />
        </div>
        <div>
          <p className='text-xs text-muted-foreground'>조회된 학생</p>
          <p className='text-xl font-semibold'>{totalStudents.toLocaleString()}</p>
        </div>
      </div>
      <Separator className='sm:hidden' />
      <div>
        <p className='text-xs text-muted-foreground'>데이터셋 수</p>
        <p className='text-xl font-semibold'>{totalDatasets.toLocaleString()}</p>
      </div>
      <Separator className='sm:hidden' />
      <div>
        <p className='text-xs text-muted-foreground'>선택된 기수</p>
        <p className='text-xl font-semibold'>{generationLabel}</p>
      </div>
    </div>
  )
}

function StudentTable({
  students,
  isLoading,
  condensedView,
}: {
  students: StudentRecord[]
  isLoading: boolean
  condensedView: boolean
}) {
  if (isLoading) {
    return (
      <div className='flex h-48 items-center justify-center rounded-xl border border-dashed'>
        <Loader />
      </div>
    )
  }

  if (!students.length) {
    return (
      <div className='rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground'>
        조회된 학생이 없습니다. 먼저 CSV/Excel 데이터를 업로드한 뒤 다시 시도하세요.
      </div>
    )
  }

  type DatasetEntry = {
    student: StudentRecord
    datasetLabel: string
    rows: Array<Record<string, unknown>>
    columnKeys: string[]
  }

  const flattenedEntries: DatasetEntry[] = []
  const studentRowSpans = new Map<string, number>()
  const studentIndexMap = new Map<string, number>()

  students.forEach((student, index) => {
    studentIndexMap.set(student.student_hash, index + 1)
  })

  students.forEach((student) => {
    const datasets = student.datasets.length
      ? student.datasets
      : [
          {
            dataset: 'none',
            rows: [],
          },
        ]

    const entries = datasets.map((dataset) => {
      const columnKeys = Array.from(
        new Set(
          dataset.rows.flatMap((row) =>
            Object.keys((row as Record<string, unknown>) ?? {}),
          ),
        ),
      )

      return {
        student,
        datasetLabel:
          dataset.dataset === 'none'
            ? '데이터 없음'
            : datasetLabelMap[dataset.dataset] || dataset.dataset,
        rows: dataset.rows as Array<Record<string, unknown>>,
        columnKeys,
      }
    })

    flattenedEntries.push(...entries)
    studentRowSpans.set(
      student.student_hash,
      entries.length || 1,
    )
  })

  const renderedStudent = new Set<string>()

  const showDetail = !condensedView

  return (
    <ScrollArea className='h-[360px] rounded-xl border'>
      <Table>
        <TableHeader className='bg-muted/30'>
          <TableRow>
            <TableHead className='w-[160px]'>학생 번호</TableHead>
            <TableHead className='w-[80px]'>기수</TableHead>
            <TableHead className='w-[140px]'>데이터셋</TableHead>
            <TableHead className='w-[100px] text-center'>행 수</TableHead>
            {showDetail && <TableHead>데이터 내용</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {flattenedEntries.map((entry, index) => {
            const studentHash = entry.student.student_hash
            const showStudentCell = !renderedStudent.has(studentHash)

            if (showStudentCell) {
              renderedStudent.add(studentHash)
            }

            return (
              <TableRow key={`${studentHash}-${entry.datasetLabel}-${index}`}>
                {showStudentCell && (
                  <>
                    <TableCell rowSpan={studentRowSpans.get(studentHash)}>
                      <code className='rounded bg-muted px-2 py-1 text-xs'>
                        {studentIndexMap.get(studentHash)}
                      </code>
                    </TableCell>
                    <TableCell rowSpan={studentRowSpans.get(studentHash)}>
                      {entry.student.generation}
                    </TableCell>
                  </>
                )}
                <TableCell className='font-semibold'>
                  {entry.datasetLabel}
                </TableCell>
                <TableCell className='text-center font-mono text-xs'>
                  {entry.rows.length.toLocaleString()}
                </TableCell>
                <TableCell>
                  {showDetail ? (
                    <DatasetGrid
                      rows={entry.rows}
                      columnKeys={entry.columnKeys}
                    />
                  ) : (
                    <DatasetSummary rows={entry.rows} />
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}

function DatasetGrid({
  rows,
  columnKeys,
}: {
  rows: Array<Record<string, unknown>>
  columnKeys: string[]
}) {
  if (!rows.length) {
    return (
      <div className='rounded border border-dashed bg-muted/20 px-3 py-2 text-xs text-muted-foreground'>
        데이터 행이 없습니다.
      </div>
    )
  }

  return (
    <div className='w-full overflow-x-auto rounded border'>
      <table className='w-full min-w-[320px] text-left text-[11px]'>
        <thead className='bg-muted/40 text-[10px] uppercase tracking-wide text-muted-foreground'>
          <tr>
            <th className='px-2 py-1 text-center'>#</th>
            {columnKeys.map((key) => (
              <th key={key} className='px-2 py-1'>
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className='odd:bg-muted/20'>
              <td className='px-2 py-1 text-center font-mono text-[10px]'>
                {rowIndex + 1}
              </td>
              {columnKeys.map((key) => (
                <td key={key} className='px-2 py-1 font-mono text-[11px]'>
                  {formatCellValue((row as Record<string, unknown>)[key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function DatasetSummary({ rows }: { rows: Array<Record<string, unknown>> }) {
  if (!rows.length) {
    return (
      <div className='rounded border border-dashed bg-muted/20 px-3 py-2 text-xs text-muted-foreground'>
        데이터 행이 없습니다.
      </div>
    )
  }

  const firstRow = rows[0]
  const previewEntries = Object.entries(firstRow ?? {}).slice(0, 4)

  return (
    <div className='flex flex-wrap gap-2 text-xs text-muted-foreground'>
      {previewEntries.map(([key, value]) => (
        <span
          key={key}
          className='rounded-full border bg-muted/30 px-2 py-1 font-mono text-[11px] text-foreground'
        >
          {key}: {formatCellValue(value)}
        </span>
      ))}
      {rows.length > 1 && (
        <span className='rounded-full bg-muted px-2 py-1 text-[11px] text-foreground'>
          + {rows.length - 1}행
        </span>
      )}
    </div>
  )
}

function formatCellValue(value: unknown) {
  if (value === null || value === undefined) return '-'
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  return String(value)
}
