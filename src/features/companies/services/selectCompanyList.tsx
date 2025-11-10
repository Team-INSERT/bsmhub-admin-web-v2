import { useQuery } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { CompanySupabase } from '../data/schema'

export const selectCompanyList = async (): Promise<CompanySupabase[]> => {
  const { data, error } = await supabase.from('companies').select('*')

  if (error) {
    // console.error("Error fetching companies:", error);
    throw new Error(error.message)
  }

  return data.sort((a, b) => a.company_name.localeCompare(b.company_name, 'ko'))
}

export const useCompanyListQuery = () => {
  return useQuery({
    queryKey: ['companies'],
    queryFn: selectCompanyList,
    staleTime: 60000,
    retry: 2,
  })
}
