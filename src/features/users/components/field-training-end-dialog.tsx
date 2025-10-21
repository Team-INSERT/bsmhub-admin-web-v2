import { useState } from 'react'
import { DialogTitle } from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'

export default function FieldTrainingEndDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (endDate: string, deleteEmployment: boolean) => void
}) {
  const [updateDate, setUpdateDate] = useState<Date>(new Date())
  const [deleteEmployment, setDeleteEmployment] = useState<boolean>(true)

  const handleConfirm = () => {
    const formatDate = (date: Date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    onConfirm(formatDate(updateDate), deleteEmployment)
    onOpenChange(false)
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>현장실습 조기종료 처리</DialogTitle>
          <DialogDescription>
            현장실습을 조기종료 처리하시겠습니까? 조기종료 처리 시, 현장실습
            종료일이 변경되며, 원할 경우 취업 정보도 함께 삭제됩니다.
          </DialogDescription>
        </DialogHeader>
        <div className='-mr-4 flex w-full flex-col gap-4 overflow-y-auto py-1 pr-4'>
          <span>종료일 선택</span>
          <div className='flex'>
            <Calendar
              mode='single'
              selected={updateDate}
              onSelect={(date) => date && setUpdateDate(date)}
              className='rounded-lg border border-border p-2'
            />
          </div>
          <div className='flex items-center gap-4'>
            <span>취업 삭제</span>
            <Switch
              checked={deleteEmployment}
              onCheckedChange={setDeleteEmployment}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleConfirm}>조기종료 처리하기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
