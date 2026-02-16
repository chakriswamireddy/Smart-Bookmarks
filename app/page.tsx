'use client'

import { supabase } from "@/utils/supabase/client"
import { useSignIn } from "./(frontend)/hooks/useSignIn"

export default function Page() {


  return <button onClick={useSignIn}>Sign in with Google</button>
}
