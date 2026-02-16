 
import { createClient } from '@/utils/supabase/server'
import Image from 'next/image'
import { useSignIn } from '../../hooks/useSignIn';
import { redirect } from 'next/navigation';
import BookmarkHeader from '../../components/BookmarksHeader';

export default async function Page() {
  const supabase = await createClient();


  const {
    data: { session },
  } = await supabase.auth.getSession()

  console.log("session",session)

  if (!session) {
    redirect('/')
  }

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
      <BookmarkHeader />


        <div className="space-y-4">
          {bookmarks?.map((bookmark) => {
            const favicon = `https://www.google.com/s2/favicons?domain=${bookmark.url}&sz=128`

            return (
              <div
                key={bookmark.id}
                className="flex items-center gap-4 bg-primary rounded-xl border border-gray-200 p-4 hover:shadow-md transition"
              >
                {/* Left 10% */}
                <div className="w-[10%] flex justify-center">
                  <Image
                    src={favicon}
                    alt="site icon"
                    width={32}
                    height={32}
                    className="rounded"
                  />
                </div>

                {/* Right 90% */}
                <div className="w-[90%]">
                  <h2 className="text-sm font-medium text-gray-900 truncate">
                    {bookmark.title}
                  </h2>
                  <p className="text-xs text-gray-500 truncate">
                    {bookmark.url}
                  </p>
                </div>
              </div>
            )
          })}

          {bookmarks?.length === 0 && (
            <div className="text-sm text-gray-500 text-center py-10">
              No bookmarks yet
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
