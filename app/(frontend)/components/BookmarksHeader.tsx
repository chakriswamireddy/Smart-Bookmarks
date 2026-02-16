'use client'

import { useState } from 'react'
import BookmarkModal from './BookmarkModal'
 

export default function BookmarkHeader() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Your Bookmarks
        </h1>

        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition"
        >
          Add Bookmark
        </button>
      </div>

      <BookmarkModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
