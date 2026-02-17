"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import BookmarkModal from "./BookmarkModal";
import ConfirmModal from "./ConfirmModal";

type Bookmark = {
  id: string;
  title: string;
  url: string;
};

const toBookmark = (row: any): Bookmark => ({
    id: row.id,
    title: row.title,
    url: row.url,
  })

export default function BookmarkList( ) {
  const supabase = createClient();

  const [selected, setSelected] = useState<Bookmark | null>(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] =  useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)

  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true

    
    const fetchInitial = async () => {
      const { data, error } = await supabase
        .from('bookmarks2')
        .select('*')
        .order('created_at', { ascending: false })

      if (!mounted) return

      if (error) {
        console.error('initial fetch error', error)
        return
      }

      setItems((data ?? []).map(toBookmark))
      setLoading(false)
    }

    fetchInitial()

 
    const channel = supabase
      .channel('bookmarks2-realtime',
        // {
        //     config: {
        //       broadcast: { self: true },  
        //     },
        //   }
        )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks2',
        },
        (payload) => {
          console.log('realtime', payload.eventType, payload)

          if (payload.eventType === 'INSERT') {
            console.log("insert eventt")
            const b = toBookmark(payload.new)
            setItems((prev) =>
              prev.some((x) => x.id === b.id) ? prev : [b, ...prev]
            )
          }

          if (payload.eventType === 'UPDATE') {
            const b = toBookmark(payload.new)
            setItems((prev) =>
              prev.map((x) => (x.id === b.id ? b : x))
            )
          }

          if (payload.eventType === 'DELETE') {
            console.log("deleted the event",payload)
            setItems((prev) =>
              prev.filter((x) => x.id !== payload.old.id)
            )

          }
        }
      )
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(channel)
    }
  }, [supabase])


  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    await supabase.from("bookmarks2").delete().eq("id", deleteId);

    setItems((prev) => prev.filter((b) => b.id !== deleteId));
    setDeleteId(null);
  };

  const handleEdit = (bookmark: Bookmark) => {
    setSelected(bookmark);
    setOpen(true);
  };

  return (
    <>
      <div className="space-y-4">
        {items.map((bookmark) => {
          const favicon = `https://www.google.com/s2/favicons?domain=${bookmark.url}&sz=128`;

          return (
            <div
              key={bookmark.id}
              className="flex items-center gap-4 bg-primary rounded-xl shadow-sm border border-gray-700 p-4 transition"
            >
              <div className="w-[10%] flex justify-center">
                <img
                  src={favicon}
                  alt="site icon"
                  width={32}
                  height={32}
                  className="rounded"
                />
              </div>

              <div className="w-[75%]">
                <h2 className="text-xl font-medium text-blue-300 truncate">
                  {bookmark.title}
                </h2>
                <p className="text-xs text-slate-400 truncate">
                  {bookmark.url}
                </p>
              </div>

              <div className="w-[15%] flex justify-end gap-3">
                <button
                  onClick={() => handleEdit(bookmark)}
                  aria-label="Edit bookmark"
                  className="p-2 rounded-md border text-gray-400 border-gray-600 hover:border-gray-400 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M21 12a1 1 0 0 0-1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h6a1 1 0 0 0 0-2H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-6a1 1 0 0 0-1-1m-15 .76V17a1 1 0 0 0 1 1h4.24a1 1 0 0 0 .71-.29l6.92-6.93L21.71 8a1 1 0 0 0 0-1.42l-4.24-4.29a1 1 0 0 0-1.42 0l-2.82 2.83l-6.94 6.93a1 1 0 0 0-.29.71m10.76-8.35l2.83 2.83l-1.42 1.42l-2.83-2.83ZM8 13.17l5.93-5.93l2.83 2.83L10.83 16H8Z"
                    />
                  </svg>
                </button>

                <button
                  onClick={() => handleDeleteClick(bookmark.id)}
                  aria-label="Delete bookmark"
                  className="p-2 rounded-md border border-gray-600 hover:border-gray-400 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#f87171"
                      fill-rule="evenodd"
                      d="m6.774 6.4l.812 13.648a.8.8 0 0 0 .798.752h7.232a.8.8 0 0 0 .798-.752L17.226 6.4zm11.655 0l-.817 13.719A2 2 0 0 1 15.616 22H8.384a2 2 0 0 1-1.996-1.881L5.571 6.4H3.5v-.7a.5.5 0 0 1 .5-.5h16a.5.5 0 0 1 .5.5v.7zM14 3a.5.5 0 0 1 .5.5v.7h-5v-.7A.5.5 0 0 1 10 3zM9.5 9h1.2l.5 9H10zm3.8 0h1.2l-.5 9h-1.2z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmModal
        open={deleteId !== null}
        title="Delete bookmark"
        description="This bookmark will be permanently removed."
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />

      <BookmarkModal
        open={open}
        onClose={() => {
          setOpen(false);
          setSelected(null);
        }}
        bookmark={selected ?? undefined}
      />
    </>
  );
}
