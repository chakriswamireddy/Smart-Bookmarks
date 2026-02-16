'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export function useAuthRedirect(redirectTo: string = '/home') {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()

      if (data.session) {
        router.replace(redirectTo)
        return
      }

      setLoading(false)
    }

    checkSession()
  }, [router, redirectTo, supabase])

  return { loading }
}
