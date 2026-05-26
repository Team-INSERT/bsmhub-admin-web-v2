import supabase from '@/utils/supabase/client'

type JobInsert = {
  job_name: string
}

export const insertJob = async (payload: JobInsert) => {
  const { data, error } = await supabase
    .from('jobs')
    .insert([payload])
    .select('*')
    .single()

  if (error) throw error
  return data
}
