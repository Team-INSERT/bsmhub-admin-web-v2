import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { Database } from '@/utils/supabase/database.types'
import { useToast } from '@/hooks/use-toast'
import { UserEditType } from '../../data/schema'

type EmploymentCompaniesInsert =
  Database['public']['Tables']['employment_companies']['Insert']
export type EmploymentCompaniesUpdate =
  Database['public']['Tables']['employment_companies']['Update']

// 실제 취업 데이터 처리 함수 (mutationFn)
const handleEmployment = async (editDataList: UserEditType) => {
  for (const editData of editDataList) {
    if (!('employment_companies' in editData.datas)) continue
    const data = editData.datas.employment_companies
    if (
      !data ||
      !data.company_id ||
      !data.job_id ||
      !data.start_date ||
      !data.student_id
    ) {
      throw new Error('누락된 취업 정보가 있습니다.')
    }

    const insertData: EmploymentCompaniesInsert = {
      student_id: data.student_id,
      company_id: data.company_id,
      job_id: data.job_id,
      start_date: data.start_date,
      end_date: data.end_date,
    }

    const updateData: EmploymentCompaniesUpdate = {
      start_date: data.start_date,
      end_date: data.end_date,
      job_id: data.job_id,
      deleted_at: data.deleted_at,
    }

    switch (editData.action) {
      case 'add': {
        const { error } = await supabase
          .from('employment_companies')
          .insert([insertData])
        if (error) throw new Error(error.message)
        break
      }
      case 'update': {
        const { error } = await supabase
          .from('employment_companies')
          .update(updateData)
          .eq('student_id', data.student_id)
          .eq('company_id', data.company_id)
        if (error) throw new Error(error.message)
        break
      }
      case 'delete': {
        const { error } = await supabase
          .from('employment_companies')
          .update({ deleted_at: new Date().toISOString() })
          .eq('student_id', data.student_id)
          .eq('company_id', data.company_id)
          .eq('job_id', data.job_id)
        if (error) throw new Error(error.message)
        break
      }
    }
  }
}

// react-query mutation hook
export const useHandleEmploymentMutation = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const mutation = useMutation({
    mutationFn: handleEmployment,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employment_companies'] })
      toast({
        variant: 'default',
        title: '취업 데이터 처리 성공!',
        description: JSON.stringify(variables, null, 2),
      })
    },
    onError: (error: unknown) => {
      const err = error as Error
      toast({
        variant: 'destructive',
        title: '취업 데이터 처리 실패',
        description: err?.message || '알 수 없는 오류가 발생했습니다.',
      })
    },
  })

  return {
    ...mutation,
    isLoading: mutation.isPending,
  }
}
