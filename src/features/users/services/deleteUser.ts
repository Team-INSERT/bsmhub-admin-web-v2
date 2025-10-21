import { useQueryClient, useMutation } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { toast } from '@/hooks/use-toast'
import { UserSupabase } from '../data/schema'

const deleteUser = async (student_id: Pick<UserSupabase, 'student_id'>) => {
  const { data, error } = await supabase
    .from('student')
    .delete()
    .eq('student_id', student_id.student_id)

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast({
        variant: 'default',
        title: '사용자 삭제 성공',
        description: '사용자가 성공적으로 삭제되었습니다.',
      })
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: '사용자 삭제 실패',
        description: error?.message || '알 수 없는 오류가 발생했습니다.',
      })
    },
  })
}
