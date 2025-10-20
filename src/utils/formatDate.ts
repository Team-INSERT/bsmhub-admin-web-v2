// 날짜를 YYYY-MM-DD 형식으로 변환

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '-'
  const dateObj = new Date(date)

  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
