'use client'

import { useAuthRedirect } from "./(frontend)/hooks/useAuthCheck"
import { useSignIn } from "./(frontend)/hooks/useSignIn"

 

export default function Page() {
  const { loading } = useAuthRedirect('/home')
   

  if (loading) return null

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          Smart Bookmark Manager
        </h1>

        <p className="text-sm opacity-80">
          Save, organize, and sync your bookmarks securely across devices.
        </p>

        <button
          onClick={useSignIn}
          className="w-full flex items-center justify-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition hover:shadow-sm"
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.5 24c0-1.57-.14-3.09-.41-4.56H24v9.14h12.7c-.55 2.96-2.2 5.47-4.7 7.18l7.24 5.63C43.87 37.1 46.5 30.96 46.5 24z"
            />
            <path
              fill="#FBBC05"
              d="M10.54 28.41c-.48-1.45-.76-2.99-.76-4.41s.27-2.96.76-4.41l-7.98-6.19C.92 16.38 0 20.05 0 24s.92 7.62 2.56 10.59l7.98-6.18z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.14 15.91-5.81l-7.24-5.63c-2.01 1.35-4.6 2.15-8.67 2.15-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.18C6.51 42.62 14.62 48 24 48z"
            />
          </svg>
          Sign in with Google
        </button>

        <p className="text-xs opacity-60">
          No passwords. Secure Google authentication.
        </p>
      </div>
    </main>
  )
}
