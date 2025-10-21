import { Badge } from "@/components/ui/badge";

export default function StatusBedge(currentFieldTraining: { company_id: number; created_at: string; deleted_at: string | null; end_date: string | null; job_id: number; lead_or_part: boolean | null; start_date: string; student_id: string; companies: { company_address: string | null; company_id: number; company_name: string; hr_manager_name: string | null; hr_manager_phone: string | null }; jobs: { job_id: number; job_name: string } } | { company_id: number; created_at: string; deleted_at: string | null; employment_id: number; end_date: string | null; job_id: number; salary: number | null; start_date: string; student_id: string; companies: { company_address: string | null; company_id: number; company_name: string; hr_manager_name: string | null; hr_manager_phone: string | null }; jobs: { job_id: number; job_name: string } }) {
  return <Badge>
    {currentFieldTraining.end_date
      ? new Date(currentFieldTraining.end_date) > new Date()
        ? '진행 중'
        : '종료'
      : '무기한'}
  </Badge>
}