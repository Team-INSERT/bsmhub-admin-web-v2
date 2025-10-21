import { HTMLAttributes, useState } from 'react'
import { IconBrandGoogle } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import supabase from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'

type UserAuthFormProps = HTMLAttributes<HTMLDivElement>

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, _setIsLoading] = useState(false)

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      {/* <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}> */}
      <div className='grid gap-2'></div>
      <div className='relative my-2'>
        <Button
          variant='outline'
          className='w-full'
          type='button'
          disabled={isLoading}
          onClick={handleGoogleSignIn}
        >
          <IconBrandGoogle className='h-4 w-4' /> Google
        </Button>
      </div>
    </div>
  )
}

async function handleGoogleSignIn() {
  const baseUrl = import.meta.env.VITE_PUBLIC_SITE_URL
  if (!baseUrl) {
    alert('Base URL is not defined')
    return
  }
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${baseUrl}/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) {
    alert(error)
    throw new Error(error.message)
    return
  }
  if (data.url) {
    console.log(data.url)
  }
  // window.open(data.url)
}
