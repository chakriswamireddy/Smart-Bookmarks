'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

type Props = {
  open: boolean
  onClose: () => void
  bookmark?: {
    id: string
    title: string
    url: string
  }
}

export default function BookmarkModal({ open, onClose, bookmark }: Props) {
  const supabase = createClient();

//   console.log(bookmark)

  const [title, setTitle] = useState(  '')
  const [url, setUrl] = useState( '')
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (bookmark) {
      setTitle(bookmark.title)
      setUrl(bookmark.url)
    } else {
      setTitle('')
      setUrl('')
    }
  }, [bookmark, open])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [open])

  if (!open) return null

  const handleSave = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setLoading(true)

    if (bookmark) {
      await supabase
        .from('bookmarks2')
        .update({ title, url })
        .eq('id', bookmark.id)
    } else {
      await supabase.from('bookmarks2').insert({ title, url })
    }

    setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute  inset-0 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-xl bg-slate-700   p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">
          {bookmark ? 'Update Bookmark' : 'Add Bookmark'}
        </h2>

        <form onSubmit={handleSave} className="space-y-5 ">
          <div className="space-y-1">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="url" className="text-sm font-medium">
              URL
            </label>
            <input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              type="url"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm px-4 py-2 rounded-md border"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="text-sm px-4 py-2 rounded-md border font-medium"
            >
              {loading ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
