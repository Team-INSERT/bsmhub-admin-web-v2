import {
  FieldTrainingType,
  EmploymentCompaniesType,
} from '@/features/users/data/schema'

export const fieldTrainingStatus: Record<number, string> = {
  0: '미취업',
  1: '현장 실습',
  2: '취업',
}

export const getFieldTrainingStatus = (
  field_training: FieldTrainingType[] = [],
  employment_companies: EmploymentCompaniesType[] = []
) => {
  const now = new Date()

  const activeEmployment = employment_companies.filter(
    (item) => item && !item?.deleted_at
  )

  const hasActiveEmployment = activeEmployment.some(({ end_date }) => {
    if (!end_date) return true
    const endDate = new Date(end_date)
    return now <= endDate
  })

  if (hasActiveEmployment) {
    return fieldTrainingStatus[2]
  }

  const activeFieldTraining = field_training.filter(
    (item) => item && !item.deleted_at
  )

  const isFieldTraining = activeFieldTraining.some(({ end_date }) => {
    if (!end_date) return true
    const endDate = new Date(end_date)
    return now <= endDate
  })

  return fieldTrainingStatus[isFieldTraining ? 1 : 0]
}
