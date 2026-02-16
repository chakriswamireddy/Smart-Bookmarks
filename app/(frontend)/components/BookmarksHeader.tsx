'use client'

import { useState } from 'react'
import BookmarkModal from './BookmarkModal'
import LogoutButton from './shared/LogoutBtm'
 

export default function BookmarkHeader() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="flex items-center gap-4 justify-between mb-10">
        <LogoutButton />
        <h1 className="flex-2   text-2xl font-semibold text-blue-300">
          Your Bookmarks
        </h1>

        <button
          onClick={() => setOpen(true)}
          className="px-4 flex-1 py-2 text-sm font-medium rounded-lg bg-gray-900 text-gray-400 hover:scale-105 hover:border-gray-800 transition"
        >
          Add Bookmark
        </button>
      </div>

      <BookmarkModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
