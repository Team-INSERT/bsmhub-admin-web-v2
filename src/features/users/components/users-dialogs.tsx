import EditProvider from '../context/edit-context'
import { useUsers } from '../context/users-context'
import { StudentDetail } from './StudentDetail'
import { UsersDeleteDialog } from './users-delete-dialog'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useUsers()
  return (
    <>
      {currentRow && (
        <>
          {open === 'edit' && (
            <div className='sticky top-[80px] h-[calc(100vh-150px)] w-full lg:w-[420px]'>
              <EditProvider>
                <StudentDetail student_id={currentRow.student_id} />
              </EditProvider>
            </div>
          )}

          <UsersDeleteDialog
            key={`user-delete-${currentRow.student_id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
