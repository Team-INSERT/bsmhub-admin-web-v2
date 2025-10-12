import { Tables } from '@/utils/supabase/database.types'
import { Badge } from '@/components/ui/badge'
import { UserDetailType } from '../data/schema'

type StudentActivitiesProps = {
  datas: {
    profile: UserDetailType['profile']
    competitions: {
      competition: Tables<'competitions'>
      prize: string
    }[]
  }
}
export const StudentActivities = ({ datas }: StudentActivitiesProps) => {
  if (!datas.profile)
    return (
      <div className='mt-4 flex justify-center'>
        학생의 활동 정보가 존재하지 않습니다.
      </div>
    )

  return (
    <div>
      <dl className='space-y-4'>
        <div>
          <dt className='mb-2 font-medium'>언어 / 기술스택</dt>
          <dd className='flex flex-wrap gap-1'>
            {datas.profile.profile_skills.length > 0 ? (
              datas.profile.profile_skills.map(({ skills }) => (
                <Badge key={skills.skill_id} variant={'secondary'}>
                  {skills.skill_name}
                </Badge>
              ))
            ) : (
              <div className='mb-5 mt-3 flex justify-center'>
                학생의 언어 / 기술스택 정보가 존재하지 않습니다.
              </div>
            )}
          </dd>
        </div>
        <div>
          <dt className='mb-1 font-medium'>수상경력</dt>
          <dd>
            {datas.competitions.length > 0 ? (
              <ul className='space-y-1'>
                {datas.profile.profile_competitions.map(
                  ({ prize, competition }, idx) => (
                    <li
                      key={idx}
                      className='border-l-2 border-primary/50 pl-2 text-sm'
                    >
                      {competition.competition_name}
                      {prize}
                    </li>
                  )
                )}
              </ul>
            ) : (
              <div className='mb-5 mt-3 flex justify-center'>
                학생의 수상경력 정보가 존재하지 않습니다.
              </div>
            )}
          </dd>
        </div>
        <div>
          <dt className='mb-1 font-medium'>프로젝트 및 경험</dt>
          <dd>
            {datas.profile.project_contributors.length > 0 ? (
              <ul className='space-y-1'>
                {datas.profile.project_contributors.map(({ project }) => (
                  <li
                    key={project.project_id}
                    className='border-l-2 border-primary/50 pl-2 text-sm'
                  >
                    {project.project_name}
                  </li>
                ))}
              </ul>
            ) : (
              <div className='mb-5 mt-3 flex justify-center'>
                학생의 프로젝트 정보가 존재하지 않습니다.
              </div>
            )}
          </dd>
        </div>
      </dl>
    </div>
  )
}
