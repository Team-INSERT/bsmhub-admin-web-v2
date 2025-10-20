import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { formatDate } from '@/utils/formatDate'
import { getCurrentFieldTraining } from '@/utils/users/getCurrentFieldTraining'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useCompanyListQuery } from '@/features/companies/services/selectCompanyList'
import { useEditUser } from '../context/edit-context'
import { useUsers } from '../context/users-context'
import { UserDetailType, UserEditType } from '../data/schema'
import { FieldTrainingUpdate } from '../services/field-training/handleFieldTraining'
import { useJobListQuery } from '../services/field-training/selectJobList'
import { AddFieldTrainingOption } from './add-field-training-option'

type addFieldTrainingType = Pick<
  FieldTrainingUpdate,
  'company_id' | 'start_date' | 'end_date' | 'job_id'
>

export const FieldTraining = ({
  datas,
}: {
  datas: UserDetailType['field_training']
}) => {
  const { editingSection, setEditData } = useEditUser()
  const { currentRow } = useUsers()

  const { data: companies = [], refetch: refetchCompanies } =
    useCompanyListQuery()
  const { data: jobs = [], refetch: refetchJobs } = useJobListQuery()

  const currentFieldTraining =
    datas.length > 0 ? getCurrentFieldTraining({ datas }) : null

  const [updateDate, setUpdateDate] = useState<DateRange | undefined>(undefined)
  const [updateJob, setUpdateJob] = useState<number | null>(null)

  const [addDate, setAddDate] = useState<DateRange | undefined>(undefined)
  const [addFieldTraining, setAddFieldTraining] =
    useState<addFieldTrainingType | null>(null)
  const [add, setAdd] = useState<boolean>(false)
  const [autoEmployment, setAutoEmployment] = useState<boolean>(false)
  const [deleteToggle, setDeleteToggle] = useState<boolean>(false)

  useEffect(() => {
    if (!editingSection) {
      setUpdateDate({
        from: currentFieldTraining?.start_date
          ? new Date(currentFieldTraining.start_date)
          : new Date(),
        to: currentFieldTraining?.end_date
          ? new Date(currentFieldTraining.end_date)
          : new Date(),
      })
      setUpdateJob(currentFieldTraining?.job_id ?? null)
      setAddDate(undefined)
      setAddFieldTraining(null)
      setAdd(false)
      setAutoEmployment(false)
      setDeleteToggle(false)
    }
  }, [editingSection, currentFieldTraining])

  useEffect(() => {
    if (
      editingSection === 'field_training' &&
      updateDate?.from &&
      updateDate?.to &&
      updateJob !== null &&
      currentFieldTraining &&
      currentRow
    ) {
      const formatDate = (date: Date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }

      setEditData([
        {
          action: 'update',
          datas: {
            field_training: {
              student_id: currentRow.student_id,
              company_id: currentFieldTraining.company_id,
              job_id: updateJob,
              start_date: formatDate(updateDate.from),
              end_date: formatDate(updateDate.to),
            },
          },
        },
      ])
    }
  }, [
    updateDate,
    updateJob,
    editingSection,
    currentFieldTraining,
    currentRow,
    setEditData,
  ])

  return (
    <div>
      {editingSection === 'field_training' ? (
        <div className='space-y-4'>
          {/* 현장실습 수정 */}
          <div className='space-y-4'>
            {currentFieldTraining && (
              <div className='relative rounded-md border p-3'>
                <div className='grid grid-cols-1 gap-3'>
                  <div className='space-y-2'>
                    <span className='font-medium'>실습 기간</span>
                    <div className='flex justify-center'>
                      <Calendar
                        mode='range'
                        selected={updateDate}
                        onSelect={setUpdateDate}
                        className='rounded-lg border border-border p-2'
                      />
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <span className='font-medium'>실습 직무</span>
                    <Select
                      value={String(updateJob)}
                      onValueChange={(value) => setUpdateJob(Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='실습 직무를 선택하세요.' />
                      </SelectTrigger>
                      <SelectContent>
                        {jobs.map((job) => (
                          <SelectItem
                            key={job.job_id}
                            value={String(job.job_id)}
                          >
                            {job.job_name}
                          </SelectItem>
                        ))}
                        <AddFieldTrainingOption
                          type='job'
                          onClick={() => {}}
                          onSuccess={() => {
                            refetchJobs()
                          }}
                        />
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='space-y-2'>
                    <span className='font-medium'>회사명</span>
                    <Select
                      value={String(currentFieldTraining.company_id)}
                      disabled
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='회사명을 선택하세요.' />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem
                            key={company.company_id}
                            value={String(company.company_id)}
                          >
                            {company.company_name}
                          </SelectItem>
                        ))}
                        <AddFieldTrainingOption
                          type='company'
                          onClick={() => {}}
                          onSuccess={() => {
                            refetchCompanies()
                          }}
                        />
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='flex items-center justify-between pt-2'>
                    <div className='flex items-center space-x-2'>
                      <span className='font-medium'>삭제</span>
                      <Switch
                        id='delete-field-training'
                        checked={deleteToggle}
                        onCheckedChange={(checked) => {
                          setDeleteToggle(checked)
                          if (checked && currentFieldTraining && currentRow) {
                            setEditData([
                              {
                                action: 'delete',
                                datas: {
                                  field_training: {
                                    student_id: currentRow.student_id,
                                    company_id: currentFieldTraining.company_id,
                                    job_id: currentFieldTraining.job_id,
                                    start_date: currentFieldTraining.start_date,
                                    end_date:
                                      currentFieldTraining.end_date ?? '',
                                  },
                                },
                              },
                            ])
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 새 현장실습 추가 */}
          <div
            className={`${add ? 'border' : 'border border-dashed'} rounded-md p-3`}
          >
            <h4 className='mb-3 font-medium'>새 현장실습 추가</h4>
            <div className='grid grid-cols-1 gap-3'>
              <div className='space-y-2'>
                <span className='font-medium'>실습 기간</span>
                <div className='flex justify-center'>
                  <Calendar
                    mode='range'
                    selected={addDate}
                    onSelect={(range) => {
                      setAddDate(range)
                      const formatDate = (date: Date) => {
                        const year = date.getFullYear()
                        const month = String(date.getMonth() + 1).padStart(
                          2,
                          '0'
                        )
                        const day = String(date.getDate()).padStart(2, '0')
                        return `${year}-${month}-${day}`
                      }
                      setAddFieldTraining((prev) => ({
                        ...prev,
                        start_date: range?.from ? formatDate(range.from) : '',
                        end_date: range?.to ? formatDate(range.to) : '',
                      }))
                    }}
                    className='rounded-lg border border-border p-2'
                  />
                </div>
              </div>
              <div className='space-y-2'>
                <span className='font-medium'>실습 직무</span>
                <Select
                  onValueChange={(value) => {
                    setAddFieldTraining((prev) => ({
                      ...prev,
                      job_id: Number(value),
                    }))
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='실습 직무를 선택하세요.' />
                  </SelectTrigger>
                  <SelectContent>
                    {jobs.map((job) => (
                      <SelectItem key={job.job_id} value={String(job.job_id)}>
                        {job.job_name}
                      </SelectItem>
                    ))}
                    <AddFieldTrainingOption
                      type='job'
                      onClick={() => {
                        // 여기에 직무 추가 로직 구현 예정
                      }}
                      onSuccess={() => {
                        refetchJobs()
                      }}
                    />
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <span className='font-medium'>회사명</span>
                <Select
                  onValueChange={(value) => {
                    setAddFieldTraining((prev) => ({
                      ...prev,
                      company_id: Number(value),
                    }))
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='회사명을 선택하세요.' />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem
                        key={company.company_id}
                        value={String(company.company_id)}
                      >
                        {company.company_name}
                      </SelectItem>
                    ))}
                    <AddFieldTrainingOption
                      type='company'
                      onClick={() => {
                        // 여기에 회사 추가 로직 구현 예정
                      }}
                      onSuccess={() => {
                        refetchCompanies()
                      }}
                    />
                  </SelectContent>
                </Select>
              </div>
              <div className='flex items-center space-x-2'>
                <span className='font-medium'>취업</span>
                <Switch
                  id='auto-employment'
                  checked={autoEmployment}
                  onCheckedChange={setAutoEmployment}
                />
              </div>
              {!add && (
                <Button
                  className='mt-2'
                  onClick={() => {
                    if (
                      addFieldTraining &&
                      currentRow?.student_id &&
                      addFieldTraining.company_id &&
                      addFieldTraining.job_id &&
                      addFieldTraining.start_date &&
                      addFieldTraining.end_date
                    ) {
                      setAdd(true)

                      const formatDateTime = (date: Date) => {
                        const year = date.getFullYear()
                        const month = String(date.getMonth() + 1).padStart(
                          2,
                          '0'
                        )
                        const day = String(date.getDate()).padStart(2, '0')
                        const hours = String(date.getHours()).padStart(2, '0')
                        const minutes = String(date.getMinutes()).padStart(
                          2,
                          '0'
                        )
                        const seconds = String(date.getSeconds()).padStart(
                          2,
                          '0'
                        )
                        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
                      }

                      const editDataArray: UserEditType = [
                        {
                          action: 'add' as const,
                          datas: {
                            field_training: {
                              ...addFieldTraining,
                              lead_or_part: false,
                              student_id: currentRow.student_id,
                              created_at: formatDateTime(new Date()),
                            },
                          },
                        },
                      ]

                      if (autoEmployment) {
                        const employmentStartDate = new Date(
                          addFieldTraining.end_date
                        )
                        employmentStartDate.setDate(
                          employmentStartDate.getDate() + 1
                        )

                        const formatDate = (date: Date) => {
                          const year = date.getFullYear()
                          const month = String(date.getMonth() + 1).padStart(
                            2,
                            '0'
                          )
                          const day = String(date.getDate()).padStart(2, '0')
                          return `${year}-${month}-${day}`
                        }

                        const formatDateTime = (date: Date) => {
                          const year = date.getFullYear()
                          const month = String(date.getMonth() + 1).padStart(
                            2,
                            '0'
                          )
                          const day = String(date.getDate()).padStart(2, '0')
                          const hours = String(date.getHours()).padStart(2, '0')
                          const minutes = String(date.getMinutes()).padStart(
                            2,
                            '0'
                          )
                          const seconds = String(date.getSeconds()).padStart(
                            2,
                            '0'
                          )
                          return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
                        }

                        editDataArray.push({
                          action: 'add' as const,
                          datas: {
                            employment_companies: {
                              student_id: currentRow.student_id,
                              company_id: addFieldTraining.company_id,
                              job_id: addFieldTraining.job_id,
                              start_date: formatDate(employmentStartDate),
                              end_date: null, // 취업 종료일은 null로 설정
                              created_at: formatDateTime(new Date()),
                            },
                          },
                        })
                      }

                      setEditData(editDataArray)
                    } else {
                      alert('누락된 현장 실습 정보가 있습니다.')
                    }
                  }}
                >
                  현장실습 추가
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>
          {currentFieldTraining ? (
            <div className='space-y-4'>
              <div className='rounded-md border p-3'>
                <dl className='space-y-2'>
                  <div className='flex gap-2'>
                    <dt className='w-24 flex-shrink-0 font-medium'>
                      실습 기간:
                    </dt>
                    <dd>{formatDate(currentFieldTraining.start_date)}</dd> ~{' '}
                    <dd>{formatDate(currentFieldTraining.end_date)}</dd>
                  </div>
                  <div className='flex gap-2'>
                    <dt className='w-24 flex-shrink-0 font-medium'>
                      실습 직무:
                    </dt>
                    <dd>{currentFieldTraining.jobs.job_name ?? '-'}</dd>
                  </div>
                  <div className='flex gap-2'>
                    <dt className='w-24 flex-shrink-0 font-medium'>회사명:</dt>
                    <dd>
                      {currentFieldTraining.companies.company_name ?? '-'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          ) : (
            <div className='mt-4 flex justify-center'>
              학생의 현장 실습 정보가 존재하지 않습니다.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
